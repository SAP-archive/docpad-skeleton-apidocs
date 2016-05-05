var pathMatchWithIndex = new RegExp(location.pathname+'$');

//this one is needed if somebody pics a url without index.html
var pathMatchNoIndex = new RegExp(location.pathname);

//get location split to identify element from top nav when clicking elements from left nav
var pathArray = window.location.pathname.split( '/' );

//if link from main devportal
var normal = pathArray[1];

//if link from internal devportal
var internal = pathArray[2];



$(window).on('load', function() {
  //works for remembering elements from left nav and top nav
  $('#left_nav a').each( function(){
    var $_this = $(this);
    var locations = ['/gettingstarted/', '/internal/gettingstarted/', '/internal/docu_guide/', '/overview/', '/internal/overview/', '/services/', '/internal/services/', '/rn/', '/internal/rn/', '/tools/', '/internal/tools/'];
    if(locations.indexOf(location.pathname)!== -1)
      return false;
    if( pathMatchWithIndex.test($_this[0].href) || pathMatchNoIndex.test($_this[0].href) ){
      $_this.parent().addClass('active')
      .parents('.parent_node:first');
      //now highlighting element from the top nav
      rememberTop();
      return false;
    }
  });

  //works for remembering elements from top nav
  $('.navbar-left li > a').not('.navbar-left .dropdown a').each( function(){
    var $_this = $(this);
    if( pathMatchWithIndex.test($_this[0].href) || pathMatchNoIndex.test($_this[0].href) || normal=="index.html" ){
      $_this.addClass('active');
      return false;
    }
  });

  // additional check for news and blog link
  var newsLink = $('.navbar-left a').filter(function(index) { return $(this).text() === "News"; });
  if (window.location.href.indexOf("rn/") != -1 || window.location.href.indexOf("blog/") != -1) {
    newsLink.addClass('active');
  }

});

// used for highlighting element from the top nav
function rememberTop(){
  if(normal=="internal"){
    $('.mobile-nav').find( "a[href*="+internal+"]" ).addClass('active');
  }else{
    $('.mobile-nav').find( "a[href*="+normal+"]" ).addClass('active');
  }
}
