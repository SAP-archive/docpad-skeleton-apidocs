function sso(o) {
  var validSignature, jws = KJUR.jws.JWS;

  function i(o, i) {
    1 === i && ($('.profile-email').html(o.login), $('.account-overlay-logged-in').show(), $('#register-button').hide(), $('.account-overlay-login').hide()),
    0 === i && ($('.profile-email').empty(), $('.account-overlay-login').show(), $('#register-button').show(), $('.account-overlay-logged-in').hide());
  }
  var n = {
    builderUrl: 'https://builder.yaas.io'
  };
  o ? n.builderUrl = o : console.log('Using Prod for SSO'), YaasAuth.init(n.builderUrl, function() {
    i('', !1);
  }), YaasAuth.getSessionInfo(function(o) {
    i(o, !0);
  }, function() {
    i('', !1);
  }), $('.sign-out').on('click', function() {
    YaasAuth.logout(), i('', !1);
    lscache.remove('id_token');
    $('.profile-email').empty(), $('.account-overlay-login').show(), $('#register-button').show(), $('.account-overlay-logged-in').hide();
  });

  window.addEventListener('message', function (e) {
    if(e.data && e.data[0] && e.data[1] && e.data[0] === 'yaas_sso_get_succ'){
      $('.account-overlay-logged-in').show(), $('#register-button').hide(), $('.account-overlay-login').hide();
      var values = JSON.parse(e.data[1]);
      validSignature = checkSignature(values.id_token);
      if(!validSignature){
        return;
      }

      lscache.set('id_token', values.id_token);
      var jws = KJUR.jws.JWS, idToken = values.id_token, tokenClaim = idToken.split('.')[1], uClaim = b64utos(tokenClaim), mail = jws.readSafeJSONString(uClaim).email;
      if(mail){
        $('.account-overlay-logged-in').show(), $('#register-button').hide(), $('.account-overlay-login').hide(), $('.profile-email').text(mail);
      }
    }
    else if(e.data[0] === 'yaas_sso_token_expired' || e.data[0] === 'yaas_sso_token_missing'){
      $('.profile-email').empty(), $('.account-overlay-login').show(), $('#register-button').show(), $('.account-overlay-logged-in').hide();
    }
  },
  false);

  if(lscache.get('id_token')){
    validSignature = checkSignature(lscache.get('id_token'));
    if(!validSignature){
      lscache.remove('id_token');
      $('.profile-email').empty(), $('.account-overlay-login').show(), $('#register-button').show(), $('.account-overlay-logged-in').hide();
    }
    else {
      var claim = getClaim(lscache.get('id_token'));
      if(new Date(claim.exp).getTime() < new Date().getTime()){
        lscache.remove('id_token');
        $('.profile-email').empty(), $('.account-overlay-login').show(), $('#register-button').show(), $('.account-overlay-logged-in').hide();
      }
      else if(claim.mail){
          $('.account-overlay-logged-in').show(), $('#register-button').hide(), $('.account-overlay-login').hide(), $('.profile-email').text(claim.mail);
      }
    }
  }

  //first call, should happen right away, not after 10 sec
  if(YaasAuth.frame && YaasAuth.frame.contentWindow){
    YaasAuth.frame.contentWindow.postMessage(JSON.stringify({ msg: 'getSessionInfo' }), '*');
  }

  var interval = window.setInterval(function() {
    if(YaasAuth.frame && YaasAuth.frame.contentWindow && !lscache.get('id_token')){
      YaasAuth.frame.contentWindow.postMessage(JSON.stringify({ msg: 'getSessionInfo' }), '*');
    }
  }, 10000);


  function checkSignature(idToken){
    var pubKey = '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzvTWJNAjx9bSmGmcPaVws1rl65tgXE5fGNucsFdUy/y42EZpW48FrqWwgYs33S/AkTxITtZWh82EW9YMXLBY8l3LFi4GGOTRpV1/5+PjCUehNS/LY026GhrmAxNkJip60ZyWQdLLrz7IQownKT+LPPr+IrMgousx62trrWQfjimgSIKXnC4Zcp64bv0zdcrc/HXPc9C7PNj/xzSC08/3Gw4dBgtswYN7NuR8EArd92UkZzsWfXYdvvN1RSyqc/FpKFAEaFDxileRL6TbBGe7A7J1RuEQalp6q5378uzTsiTQb0o+9952SoL2W5l63jrLG9THD1oF4v+Xb4Afb0tKEwIDAQAB-----END PUBLIC KEY-----';
    var result = false;

    try {
      result = Boolean(jws.verify(idToken, pubKey, ['RS256']));
    }
    catch(ex) {
      return false;
    }
    return result;
  }

  function getClaim(idToken){
    var tokenClaim = idToken.split('.')[1],
      uClaim = b64utos(tokenClaim);

    return jws.readSafeJSONString(uClaim);
  }
}
