'use strict'

app.controller('AuthCtrl', ['$scope','token','Restangular','config','$window','restAngularService', '$location', 'helperService', 'AuthFactory', 'LsCacheFactory', 'RedirectFactory', 'AccountFactory', function($scope, token, Restangular, config, $window, restAngularService, $location, helperService, AuthFactory, LsCacheFactory, RedirectFactory, AccountFactory){
    /* Variables + helper functions*/
    var oAuthBased = restAngularService.OAuthBased();
    $scope.errorMessage = '';

    $scope.saveAuth = function(){
        var token_internal = helperService.extractData(token, 'access_token');
        var scopes = helperService.extractData(token, 'scope');

        LsCacheFactory.SetToken(token_internal);
        LsCacheFactory.SetScopes(scopes);

        AuthFactory.GetAuthor().then(function(author){
            LsCacheFactory.SetAuthor(author, 59);
            RedirectFactory.RedirectToManage();
        }, function(){
            //add error case, rest call failed
        })

        AccountFactory.GetUsersOfRole('Publisher').then(function(response){
            LsCacheFactory.SetPublisherUsers(helperService.ExtractUsersFromResponse(response));
        })


    }

    $scope.CheckAuthorize = function(){
        if(token) {
            $scope.authorized = true;
            $scope.saveAuth();
        }
        else
        {
            $scope.authorized = false;
            RedirectFactory.RedirectToExternalAuthService();
        }
    }

    $scope.CheckAuthorize();


}])
