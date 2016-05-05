'use strict';

app.factory('helperService', ['config', '$window', '$location', 'LsCacheFactory', '$route', 'AccountFactory', function(config, $window, $location, LsCacheFactory, $route, AccountFactory){

    var helperService = {};

    var _extractUsersFromResponse = function(response){
        var arr = [];

        angular.forEach(response, function(el){
            var element = el.email;//(el.firstName && el.lastName) ? (el.firstName + ' ' + el.lastName) : el.email;
            arr.push(element);
          });

        return arr;
      };

    var replaceAll = function(find, replace, str) {
        return str.split(find).join(replace);

      };

    var injectHighlightTags = function(content){
        //preparation, replacement of proper tags
        var final = replaceAll('<code class="language-', '<div id="hl" hljs language="', content);
        //var final = reoplaceAll(content);
        final= replaceAll('</code>', '</div>', final);
        final = replaceAll('&gt;', '>', final);
        final = replaceAll('&lt;', '<', final);
        return final;

      };

    var _getPostIdFromRoute = function(){
        return $route.current.params.postId;
      };

    var _hasAccesToken = function(){
        if (LsCacheFactory.GetToken() && LsCacheFactory.GetAuthor())
          return true;
        else return false;

      };

    var _hasAnnonToken = function(){
        if(LsCacheFactory.GetAnonToken())
          return true;
        else return false;
      };

      /**
       * [function _extractData]
       * @param  {String} res   [response from oauth with acces_token, scopes etc.]
       * @param  {String} value [key you want to retrieve from res]
       * @return {String}       [return requested value]
       */
    var _extractData = function(res, value){
        var queryString = {};
        res.replace(
            new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
            function($0, $1, $2, $3) { queryString[$1] = $3; }
        );
        return queryString[value];
      };

    var _extractAnonKey = function(response){
        //ar res = JSON.stringify(response);
        //var parseRes = $.parseJSON(res);
        return response.access_token;
      };

    var _prepareAuthor = function(firstName, lastName){
        if(firstName && lastName)
          return firstName + ' ' + lastName;
        else if(!firstName)
          return lastName;
        else return firstName;
      };

    var _isPublisher = function(scopes, users){
        var email = LsCacheFactory.GetEmail();

        if(scopes && users){
          var indexPublisher = scopes.indexOf('hybris.product_publish');
          return users.indexOf(email) > -1 && indexPublisher > -1 ?  true : false;
        }
        else return false;
      };

    var _isUnPublisher = function(scopes, users){
        var email = LsCacheFactory.GetEmail();
        if(scopes && users){
          var indexUnPublisher = scopes.indexOf('hybris.product_unpublish');
          return users.indexOf(email) > -1 && indexUnPublisher > -1 ?  true : false;
        }
        else return false;
      };

    var _isInternal = function(){
        var link = $location.absUrl();
        return link.indexOf('/internal/') > -1 ? true : false;
      };

    var _isAuthorAsEmail = function(){
      var author = LsCacheFactory.GetAuthor();

      if(author && author.indexOf('@') > -1)
        return true;
      else return false;

    };


    helperService.hasAccessToken = _hasAccesToken;
    helperService.extractData= _extractData;
    helperService.extractAnonKey = _extractAnonKey;
    helperService.PrepareAuthor = _prepareAuthor;
    helperService.HasAnnonToken = _hasAnnonToken;
    helperService.GetPostIdFromRoute = _getPostIdFromRoute;
    helperService.InjectHighlightTags = injectHighlightTags;
    helperService.IsPublisher = _isPublisher;
    helperService.IsUnPublisher = _isUnPublisher;
    helperService.ExtractUsersFromResponse = _extractUsersFromResponse;
    helperService.IsInternal = _isInternal;
    helperService.IsAuthorAsEmail = _isAuthorAsEmail;

    return helperService;
  }]);
