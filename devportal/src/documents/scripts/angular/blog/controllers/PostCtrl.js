'use strict';

app.controller('PostCtrl', ['$scope', 'Restangular', 'config', '$window', 'PostFactory', 'helperService', 'isInternal', 'restAngularService', 'AuthFactory', 'LsCacheFactory', '$location', 'MessageFactory', function($scope, Restangular, config, $window, PostFactory, helperService, isInternal, restAngularService, AuthFactory, LsCacheFactory, $location, MessageFactory){

    $scope.isInternal = isInternal;
    $scope.audience = isInternal ? '?q=mixins.post.audience:"Visible to Internal Only"' : '?q=mixins.post.audience:"Visible to All"';
    $scope.title = $scope.isInternal ? "Internal Blog" : "Blog";
    $scope.scopes = LsCacheFactory.GetScopes();
    $scope.errorMessage = '';

    if($location.hash()) {
        $location.path($location.hash());
    }

    $scope.initialize = function(){

        var getPostByAudience = function(){
            PostFactory.GetPostsByAudience($scope.audience).then(function(posts){
                $scope.posts = posts;
                $scope.restCall = false;
            }, function(res){
                $scope.errorMessage = MessageFactory.ProductGetFailedMessages;
                $scope.restCall = false;
            });
        }

        if(helperService.HasAnnonToken()){
            getPostByAudience();
        }
        else {
            AuthFactory.GetAnonKey().then(function (response) {
                LsCacheFactory.SetAnonKey(helperService.extractAnonKey(response));
                getPostByAudience();
                $scope.restCall = false;
            }, function(res){
                $scope.errorMessage = MessageFactory.AnonTokenFailedMessage;
                $scope.restCall = false;
            });
        }
    }
    $scope.restCall = true;
    $scope.initialize();

}])