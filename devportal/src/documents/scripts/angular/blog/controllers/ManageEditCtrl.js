'use strict'

app.controller('ManageEditCtrl', function($scope, $rootScope, Restangular, helperService, config, restAngularService, $route, $location, PostFactory, MetadataFactory, RedirectFactory, $compile, LsCacheFactory,$modal, AccountFactory, AutoSaveFactory, $interval, MessageFactory){

    //we have to enable this for tooltips at tags
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();

    $scope.post = {};
    $scope.action = 'edit';
    $scope.highlighted = '';
    var initialContent = '';
    var save_interval;
    $scope.authorMessage = '';
    $scope.infoMessage = '';
    $scope.succeed = false;

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

    var setPublishProgress = function(){
      $scope.restCallButton = true;
    };

    var stopPublishProgress = function(){
      $scope.restCallButton = false;
    };

    var setDeleteProgress = function(){
      $scope.restCallDelete = true;
    };

    var stopDeleteProgress = function(){
      $scope.restCallDelete = false;
    };

    var cleanAutoSaveVariables = function(){
        LsCacheFactory.SetTempEditPost('');
        $interval.cancel(save_interval);
    };

    var setCssClasses = function() {

        $scope.cssClassSave = isAllowedToSave() ? 'btn btn-primary' : 'btn';
        $scope.cssClassPublish = isAllowedToPublish() ? 'btn btn-link' : 'btn';
        $scope.cssClassUnPublish = isAllowedToUnPublish() ? 'btn btn-default' : 'btn';
        $scope.cssClassDelete = isAllowedToDelete() ? 'btn btn-danger' : 'btn';

    };

    var setPublishers = function(){
        $scope.isPublisher = helperService.IsPublisher(scopes, users, $scope.post);
        $scope.isUnpublisher = helperService.IsUnPublisher(scopes, users, $scope.post);

    };

    var forceCssClasses = function(allowed){
        $scope.cssClassSave = allowed ? 'btn btn-primary' : 'btn';
        $scope.cssClassPublish = allowed ? 'btn btn-link' : 'btn';
        $scope.cssClassUnPublish = allowed ? 'btn btn-default' : 'btn';
        $scope.cssClassDelete = allowed ? 'btn btn-link' : 'btn';

    };

    var forcePublishers = function(value){

        $scope.isPublisher = value;
        $scope.isUnpublisher = value;
    };

    //old val and new val represent value passedby watch expression. We have to do it that way because
    // we have to validate on-runing validation (so we have to detect for example if user change visible all to Internal and so on)
    var updatePublishers = function(newVal, oldVal){
        if(newVal && oldVal)
        {
            //if we are not publishers and post is published and we want to change visibility and save- error.. we shouldnt be allowed to.
            if($scope.initialAudience === 'Visible to All' && $scope.post.published && oldVal === 'Visible to All' && newVal === 'Visible to Internal Only' && !$scope.isPublisher)
            {
                forceCssClasses(false);
                forcePublishers(false);
            }
            else {
                setPublishers();
                $scope.audience = $scope.post.mixins.post.audience;
                setCssClasses();
            }
        }
        else {
            setPublishers();
            $scope.audience = $scope.post.mixins.post.audience;
            setCssClasses();
        }

    };

    var isAllowedToPublish = function(){
        return ($scope.isPublisher || $scope.audience === 'Visible to Internal Only') && !$scope.restCallButton;
    };

    var isAllowedToUnPublish = function(){
        return ($scope.isUnpublisher || $scope.audience === 'Visible to Internal Only') && !$scope.restCallButton;

    };

    var isAllowedToDelete = function(){
        return ($scope.isPublisher || $scope.audience === 'Visible to Internal Only') && !$scope.restCallButton;

    };

    var isAllowedToSave = function(){
        return (!$scope.post.published || $scope.isPublisher || $scope.post.published && $scope.audience === 'Visible to Internal Only') && !$scope.restCallButton;
    };

    var users = LsCacheFactory.GetPublisherUsers();
    var scopes = LsCacheFactory.GetScopes();
    setPublishers();

    var original;
    $scope.audience = '';

    $scope.options = {
        language: 'en',
        allowedContent: true,
        entities: false
    };

    $scope.showTipModal = function(isSaveButton){

        var modalInstance = $modal.open({
            templateUrl: '/internal/blog/managing/modalTip.html',
            resolve: {
                isSaveButton: function(){
                    return isSaveButton;
                }
            },
            controller: 'ShowTipCtrl',
            size: 'sm'
        });

        modalInstance.result.then(function () {
        }, function () {
        });
    };

    $scope.ResolvePublish = function(){

        if(isAllowedToPublish())
            $scope.publish();
        else $scope.showTipModal(false);
    };

    $scope.ResolveUnPublish = function(){

        if(isAllowedToUnPublish())
            $scope.unPublish();
        else $scope.showTipModal(false);
    };

    $scope.ResolveSave = function(){
        if(isAllowedToSave())
            $scope.save();
        else $scope.showTipModal(true);
    };

    $scope.ResolveDelete = function(){
        if(isAllowedToDelete())
            $scope.destroy();
        else $scope.showTipModal(true);
    };

    $scope.cancel = function(){
        cleanAutoSaveVariables();
        $location.path('/manage');
    };

    $scope.isClean = function () {
        return angular.equals(original, $scope.post);
    };

    $scope.unPublish = function () {
        $scope.restCallButton = true;

        delete $scope.post.customAttributes;
        delete $scope.post.media;
        delete $scope.tempPublished;
        $scope.post.metadata = MetadataFactory.GetMetadata();
        $scope.post.published = false;

        setPublishProgress();
        PostFactory.PutPost($scope.post).then(function(post){
            cleanAutoSaveVariables();
            stopPublishProgress();
            $rootScope.message = MessageFactory.CreateInfoMessage(false, 'unpublish');
            RedirectFactory.RedirectToManage();
        }, function(err){
          stopPublishProgress();
          setInfo(true, MessageFactory.ProductSubmitFailedMessage);

        });
    };

    $scope.publish = function () {

        delete $scope.post.customAttributes;
        delete $scope.post.media;
        delete $scope.tempPublished;
        $scope.post.metadata = MetadataFactory.GetMetadata();
        $scope.post.published = true;

        setPublishProgress();
        PostFactory.PutPost($scope.post).then(function(res){
            cleanAutoSaveVariables();
            stopPublishProgress();
            $rootScope.message = MessageFactory.CreateInfoMessage(false, 'publish');
            RedirectFactory.RedirectToManage();
        }, function(){
            setInfo(true, MessageFactory.ProductSubmitFailedMessage);
            stopPublishProgress();
        });
    };

    $scope.destroy = function () {
        cleanAutoSaveVariables();
        setDeleteProgress();
        PostFactory.DeletePost().then(function(){
            cleanAutoSaveVariables();
            stopDeleteProgress();
            $rootScope.message = MessageFactory.CreateInfoMessage(false, 'delete');
            RedirectFactory.RedirectToManage();
        }, function(err){
            setInfo(true, MessageFactory.ProductSubmitFailedMessage);
            stopDeleteProgress();
        });
    };

    $scope.save = function () {
        delete $scope.post.customAttributes;
        delete $scope.post.media;
        delete $scope.tempPublished;
        $scope.post.metadata = MetadataFactory.GetMetadata();

        setSaveProgress();
        PostFactory.PutPost($scope.post).then(function(){
            cleanAutoSaveVariables();
            stopSaveProgress();
            $rootScope.message = MessageFactory.CreateInfoMessage(false, 'save');
            RedirectFactory.RedirectToManage();
        }, function(err){
           setInfo(true, MessageFactory.ProductSubmitFailedMessage);
           stopSaveProgress();
        });

    };

    // Loads original value to post (value stored in database).
    $scope.LoadOrginalContent = function(){
        AutoSaveFactory.FillOutEditPost($scope.post, initialContent);
        $scope.fillOut = false;
        $scope.showModifiedTip = false;
    };

    // Closes tips on top of the page when auto-saved value is loaded.
    $scope.CloseModifiedTips = function(){
        $scope.fillOut = false;
        $scope.showModifiedTip = false;
    };


    /***********************************************************/
    $scope.initialize = function(){
        if (helperService.hasAccessToken()) {

            $scope.restCallEdit = true;
            PostFactory.GetSinglePostByRouteIdManage(helperService.GetPostIdFromRoute()).then(function(res){
                $scope.restCallEdit = false;
                $scope.post = res;
                initialContent = Restangular.copy(res);
                $scope.tempPublished = $scope.post.published;
                $scope.initialAudience = $scope.post.mixins.post.audience;
                $scope.audience = $scope.post.mixins.post.audience;
                setCssClasses();


                $scope.$watch('post.mixins.post.audience', function(newVal, oldVal){
                    updatePublishers(newVal, oldVal);
                });

                $scope.$watch('post.mixins.post.content', function(newVal, oldVal){
                    if(newVal.indexOf('<code class') > -1)
                        $scope.highlighted = helperService.InjectHighlightTags(newVal);
                    else $scope.highlighted = newVal;
                });


                save_interval = AutoSaveFactory.CreateSaveIntervalEdit($scope.post);
                if(AutoSaveFactory.CheckFilloutConditions($scope.post, initialContent)) {
                    $scope.fillOut = true;
                    AutoSaveFactory.FillOutEditPost($scope.post);
                }
                else if(AutoSaveFactory.CheckLastModifiedConditions($scope.post)) {
                    $scope.showModifiedTip = true;
                    AutoSaveFactory.FillOutEditPost($scope.post);

                }

                //destroying interval when scope is destroyed, otherwise if we change path interval its still working
                $scope.$on('$destroy', function(){
                    $interval.cancel(save_interval);
                });

            }, function(err){
              $scope.restCallEdit = false;
              setInfo(true, MessageFactory.ProductDetailNotFoundMessage);
            });
        }
        else RedirectFactory.RedirectToAuth();
    };

    $scope.initialize();

});
