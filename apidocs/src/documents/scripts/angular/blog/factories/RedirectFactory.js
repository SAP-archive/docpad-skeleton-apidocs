'use strict'

app.factory('RedirectFactory', ['$location', 'config', '$window', function($location, config, $window){

    var redirectFactory = {};

    var _redirectToAuth = function(){
        $location.path('/auth');
    };

    var _redirectToManage = function(){
        $location.path('/manage');
    };

    var _redirectToPostEdit = function(id){
      $location.path('/manage/edit/' + id);
    };

    var _reload = function() {
        $window.location.reload();
    };

    var _redirectToExternalAuthService = function(){
        $window.location.replace(config.oauthService() + config.oauthEndpoint() + "?response_type=token&client_id=" + config.clientId() + "&scope=hybris.product_delete hybris.product_update hybris.product_publish hybris.product_unpublish hybris.product_create hybris.product_read_unpublished hybris.account_view&redirect_uri=" + config.redirect_uri());
    };

    var _openInNewTab = function(url){
      $window.open(url, '_blank');
    }


    redirectFactory.RedirectToManage = _redirectToManage;
    redirectFactory.RedirectToAuth = _redirectToAuth;
    redirectFactory.Reload = _reload;
    redirectFactory.RedirectToExternalAuthService = _redirectToExternalAuthService;
    redirectFactory.RedirectToPostEdit = _redirectToPostEdit;
    redirectFactory.OpenInNewTab = _openInNewTab;

    return redirectFactory;

}]);
