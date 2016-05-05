'use strict';

app.controller('ManageCreateCtrl', function($scope, Restangular, config, helperService, restAngularService, $location, LsCacheFactory, PostFactory, MetadataFactory, RedirectFactory, $interval, AutoSaveFactory, MessageFactory, $rootScope){

    //we have to enable this for tooltips at tags
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();

    $scope.post = {};
    $scope.action = 'create';
    $scope.cssClassSave = 'btn btn-primary';
    
    $scope.infoMessage = '';
    $scope.succeed = false;

    var isAuthorAsEmail = helperService.IsAuthorAsEmail();
    $scope.authorMessage = isAuthorAsEmail ? MessageFactory.CreateAuthorWarningMessage() : '';

    $scope.logoutAndRedirect = function() {
      LsCacheFactory.ClearCredentials();
      RedirectFactory.RedirectToExternalAuthService();
    };

    $scope.redirectToBuilder = function(){
      var profileBuilderUrl = config.builderUrl() + "#?selectedPath=%2FMy%20Profile%2FProfile";

      RedirectFactory.OpenInNewTab(profileBuilderUrl);
    }

    var original;
    var save_interval;

    var setInfo = function(isError, message){
      $scope.succeed = !isError;
      $scope.infoMessage = message;
    };

    var setSaveProgress = function(){
      $scope.restCallSave = true;
    };

    var stopSaveProgress = function(){
      $scope.restCallSave = false;
    };

    // Its that way cause 2 controllers share view which has ResolveSave as one of the button functions
    $scope.ResolveSave = function(){
        $scope.save();
    };

    $scope.isClean = function () {
        return angular.equals(original, $scope.post);
    };

    var cleanAutoSaveVariables = function(){
        LsCacheFactory.SetTempCreatePost('');
        $interval.cancel(save_interval);
    };

    $scope.save = function() {
        setSaveProgress();
        PostFactory.CreatePost($scope.post).then(function(post) {
          cleanAutoSaveVariables();
          stopSaveProgress();
          $rootScope.message = MessageFactory.CreateInfoMessage(false, 'create', post.id);
          RedirectFactory.RedirectToManage();
        }, function(err){
          stopSaveProgress();
          setInfo(true, MessageFactory.ProductSubmitFailedMessage);
        });
    };

    $scope.cancel = function(){
        cleanAutoSaveVariables();
        RedirectFactory.RedirectToManage();
    };

    $scope.initialize = function(){

        $scope.post = MetadataFactory.PreparePostObject();
        var original = Restangular.copy($scope.post);

        if (helperService.hasAccessToken()){

            $scope.$watch('post.mixins.post.content', function(newVal, oldVal){
                if(newVal)
                {
                    if(newVal.indexOf('<code class') > -1)
                      $scope.highlighted = helperService.InjectHighlightTags(newVal);
                    else $scope.highlighted = newVal;
                }

            });

            //for auto-saving post we're creating.
            save_interval = AutoSaveFactory.CreateSaveIntervalCreate($scope.post);
            // We do it cause otherwise after changing path timeout still worked, after scope is destroyed we cancel our internval.
            $scope.$on('$destroy', function(){
                $interval.cancel(save_interval);
            });

            AutoSaveFactory.FillOutCreatePost($scope.post);
        }
        else RedirectFactory.RedirectToAuth();
    };

    $scope.initialize();

});
