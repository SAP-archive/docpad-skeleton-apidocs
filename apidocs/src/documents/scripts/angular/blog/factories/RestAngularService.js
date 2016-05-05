'use strict'

//Factory created for maintenance various options of restAngular instances used in application
app.factory('restAngularService',['config','Restangular', 'LsCacheFactory', function(config, Restangular, LsCacheFactory){

    var restAngularService = {};

    var _account = function () {
        return Restangular.withConfig(function(RestangularConfigurer) {

            RestangularConfigurer.setDefaultHeaders({ Authorization: 'Bearer '+ LsCacheFactory.GetToken() });
            RestangularConfigurer.setRestangularFields({
                id: 'id'
            });
            RestangularConfigurer.setBaseUrl(config.accountService());

            return RestangularConfigurer;
        });
    }

    var _auth = function() {
        return Restangular.withConfig(function(RestangularConfigurer) {
            return RestangularConfigurer.setBaseUrl(config.oauthService());
        })
    };

    var _manage = function() {

        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(config.productService());
            RestangularConfigurer.setDefaultHeaders({ Authorization: 'Bearer '+ LsCacheFactory.GetToken() });
            RestangularConfigurer.setRestangularFields({
                id: 'id'
            });
            RestangularConfigurer.addFullRequestInterceptor(function(elem, operation, what) {

                if (operation === 'put') {
                    elem.id = undefined;
                    return elem;
                }
                return elem;
            });

            return RestangularConfigurer;
        });
    }

    var _post = function() {
        return Restangular.withConfig(function(RestangularConfigurer) {

            RestangularConfigurer.setBaseUrl(config.productService());
            RestangularConfigurer.setDefaultHeaders({ Authorization: 'Bearer ' + LsCacheFactory.GetAnonToken()});
            RestangularConfigurer.setRestangularFields({
                id: 'id'
            });
            return RestangularConfigurer;
        })
    };

    restAngularService.AccountBased = _account;
    restAngularService.OAuthBased = _auth;
    restAngularService.Manage = _manage;
    restAngularService.Post = _post;

    return restAngularService;
}])