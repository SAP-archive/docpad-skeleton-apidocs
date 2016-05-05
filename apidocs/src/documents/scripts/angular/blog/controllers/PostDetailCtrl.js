'use strict'

app.controller('PostDetailCtrl', function($scope, Restangular, config, $window, $route, restAngularService, LsCacheFactory, PostFactory, AuthFactory, helperService, RedirectFactory, MessageFactory){
    $scope.postUrl = helperService.IsInternal() ? '/internal/blog' : '/blog';
    $scope.errorMessage = '';

    $scope.initialize = function(){

        var getSinglePostByRouteId = function(){

            $scope.restCall = true;
            PostFactory.GetSinglePostByRouteId(helperService.GetPostIdFromRoute()).then(function (res) {
                $scope.detailedPost = res;
                $scope.highlighted = res.mixins.post.content;
                $scope.restCall = false;
            }, function (res) {
                if (res.status == 404) {
                    $scope.errorMessage = MessageFactory.ProductDetailNotFoundMessage;
                }
                else $scope.errorMessage = MessageFactory.ProductGetFailedOneMessage;
                $scope.restCall = false;
            });

        }


        if (LsCacheFactory.GetAnonToken()) {
            getSinglePostByRouteId();
        }
        else {
            $scope.restCall = true;
            AuthFactory.GetAnonKey().then(function (response) {
                $scope.restCall = false;
                LsCacheFactory.SetAnonKey(helperService.extractAnonKey(response));
                getSinglePostByRouteId();
            }, function(res){
                $scope.errorMessage = MessageFactory.AnonTokenFailedMessageDetail;
                $scope.restCall = false;
            });
        }
    }

    $scope.initialize();

})
