'use strict'
app.controller('ManageCtrl', ['$scope', '$rootScope', 'helperService', '$location', 'PostFactory', 'RedirectFactory', 'MessageFactory', '$timeout', '$filter', function($scope, $rootScope, helperService, $location, PostFactory, RedirectFactory, MessageFactory, $timeout, $filter){

    $scope.query        = "";
    $scope.sortType     = 'mixins.post.date';
    $scope.sortReverse  = true;

    var checkInfoMessages = function(){

      //meessage from rootScope comes from ManageEditCtrl, which informs us about operation and messafge to show
      var message = angular.copy($rootScope.message);
      delete $rootScope.message;

      $scope.infoMessage = message ? message : '';
      $scope.cssClass = 'success';
      $timeout(function(){ $scope.infoMessage = ''}, 5000);
    };

    $scope.redirectToPost = function(id){
      RedirectFactory.RedirectToPostEdit(id);
    };


    $scope.initialize = function(){
        if (helperService.hasAccessToken()){
          $scope.restCall = true;
            PostFactory.GetPosts().then(function(results){
                $scope.posts = results;
                $scope.restCall = false;
            }, function(){
              $scope.cssClass = 'danger';
              $scope.infoMessage = MessageFactory.ProductGetFailedMessages;
            });
        }
        else RedirectFactory.RedirectToAuth();
    };

    $scope.search = function (row) {
        var shortDate = $filter('date')(new Date(row.mixins.post.date), 'short');

        return !!((row.mixins.post.author.indexOf($scope.query || '') !== -1 || row.name.indexOf($scope.query || '') !== -1 || row.mixins.post.audience.indexOf($scope.query || '') !== -1 || row.mixins.post.tag.indexOf($scope.query || '') !== -1 || shortDate.indexOf($scope.query || '') !== -1));
    };

    $scope.initialize();
    checkInfoMessages();


}]);
