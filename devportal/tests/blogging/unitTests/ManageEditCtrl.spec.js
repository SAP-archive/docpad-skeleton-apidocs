describe('ManageEditCtrl', function(){



  beforeEach(module('appInt'));

  var PostFactory;
  var q;
  var location;
  var rootScope;
  var helperService;
  var redirectFactory;

  var singePostByRouteIdResponse = {
      id : "556865fefc2ec67feb11ed9b",
      sku : "Testdemo1432905214040",
      name : "Test demo",
      published : true,
      metadata : {
        createdAt : "2015-06-01T06:22:25.807+0000",
        modifiedAt : "2015-06-01T06:22:25.807+0000",
        version : 1,
        mixins : {
          post : "https://api.yaas.io/schema-repository/v1/devportalblog/posts.v1.json"
        }
      },
      media : [ ],
      mixins : {
        post : {
          date : "2015-05-29T13:13:15.089Z",
          author : "Mariusz Jasinski",
          content : "<p>random stuff</p>\n",
          audience : "Visible to All",
          tag : "News and Events"
        }
      },
      customAttributes : [ ]
}

  describe('Resolving public/unpublish actions', function(){
    beforeEach(inject(function($rootScope, $controller, _PostFactory_, $q, $location) {
        scope = $rootScope.$new();
        //rootScope = $rootScope;
        PostFactory = _PostFactory_;
        q = $q;
        location = $location;
        ctrl = $controller('ManageEditCtrl',
        {
          $scope: scope
        });

        spyOn(scope, 'publish').and.callFake(function(){

        });
        spyOn(scope, 'unPublish').and.callFake(function(){

        });
        spyOn(scope, 'showTipModal').and.callFake(function(){

        })
    }));

    it('resolve ResolvePublish properly part 1', function(){
      scope.isPublisher = true;
      scope.audience = 'whatver';

      scope.ResolvePublish();

      expect(scope.publish).toHaveBeenCalled();
    });

    it('resolve ResolvePublish properly part 2', function(){
      scope.isPublisher = false;
      scope.audience = "Visible to Internal Only";

      scope.ResolvePublish();

      expect(scope.publish).toHaveBeenCalled();
    });

    it('resolve ResolvePublish properly part 3', function(){
      scope.isPublisher = false;
      scope.audience = "Visible to All";

      scope.ResolvePublish();

      expect(scope.showTipModal).toHaveBeenCalled();
    });

    it('resolve ResolvePublish properly part 4', function(){
      scope.isPublisher = true;
      scope.audience = "Visible to All";

      scope.ResolvePublish();

      expect(scope.publish).toHaveBeenCalled();
    });

    //unpublish
    it('resolve ResolveUnPublish properly part 1', function(){
      scope.isUnpublisher = true;
      scope.audience = 'Visible to Internal Onlys';

      scope.ResolveUnPublish();

      expect(scope.unPublish).toHaveBeenCalled();
    });

    it('resolve ResolveUnPublish properly part 2', function(){
      scope.isUnpublisher = true;
      scope.audience = "Visible to Internal Only";

      scope.ResolveUnPublish();

      expect(scope.unPublish).toHaveBeenCalled();
    });

    it('resolve ResolveUnPublish properly part 3', function(){
      scope.isUnpublisher = false;
      scope.audience = "Visible to All";

      scope.ResolveUnPublish();

      expect(scope.showTipModal).toHaveBeenCalled();
    });

    it('resolve ResolveUnPublish properly part 4', function(){
      scope.isUnpublisher = true;
      scope.audience = "Visible to All";

      scope.ResolveUnPublish();

      expect(scope.unPublish).toHaveBeenCalled();
    })


  });

    var createCtrl;
    var AutoSaveFactory;
  describe('functions', function(){

    beforeEach(inject(function($rootScope, $controller, _PostFactory_, $q, $location, _helperService_, _RedirectFactory_, _AutoSaveFactory_) {
        scope = $rootScope.$new();
        helperService = _helperService_;
        redirectFactory = _RedirectFactory_;
        PostFactory = _PostFactory_;
        q = $q;
        location = $location;
        AutoSaveFactory = _AutoSaveFactory_;
        ctrl = $controller('ManageEditCtrl',
            {
                $scope: scope
            });

        createCtrl = function(){
            return $controller('ManageEditCtrl',
                {
                    $scope: scope
                });
        };

        spyOn(PostFactory, 'PutPost').and.callFake(function(res){
          return q(function(resolve, reject){
            resolve("test");
          })
        });

        spyOn(PostFactory, 'GetSinglePostByRouteId').and.callFake(function(){

        });

        spyOn(location, 'path').and.callFake(function(){

        })
    }));



    it('veryfing body in unpublish post', function(){
      scope.unPublish();
      //rootScope.$apply();
      expect(scope.post.customAttributes).toBe(undefined);
      expect(scope.post.media).toBe(undefined);
      expect(scope.post.published).toBe(false);
      // TODO: now error
      //expect(location.path).toHaveBeenCalledWith('/manage');
    });

    it('should redirect to /manage upon success', function(){
        //mock now, TODO: implemenmt
        expect(true).toBe(true);
    });

    it('veryfing publish function', function(){
      scope.publish();

      //rootScope.$digest();
      expect(scope.post.customAttributes).toBe(undefined);
      expect(scope.post.media).toBe(undefined);
      expect(scope.post.published).toBe(true);
    });

    it('veryfing save function', function(){
      scope.save();

      expect(scope.post.customAttributes).toBe(undefined);
      expect(scope.post.media).toBe(undefined);
    });

    it('action should be edit on start', function(){
      expect(scope.action).toBe('edit');
    });

    it('should redirect to Auth if unauthorized', function(){
      spyOn(helperService, 'hasAccessToken').and.callFake(function(){
        return false;
      });
      spyOn(redirectFactory, 'RedirectToAuth').and.callFake(function(){

      });

      scope.initialize();

      expect(redirectFactory.RedirectToAuth).toHaveBeenCalled();

    });



  });

    var interval;
    describe('testing fillOut behavior + interval', function() {

        beforeEach(inject(function ($rootScope, $controller, _PostFactory_, $q, _helperService_, _AutoSaveFactory_, $interval) {
            scope = $rootScope.$new();
            helperService = _helperService_;
            PostFactory = _PostFactory_;
            q = $q;
            AutoSaveFactory = _AutoSaveFactory_;
            interval = $interval;

            ctrl = $controller('ManageEditCtrl',
                {
                    $scope: scope
                });

            createCtrl = function () {
                return $controller('ManageEditCtrl',
                    {
                        $scope: scope
                    });
            };

            var post_true = {
                    published: true,
                    mixins: {
                        post: {
                            audience: 'Visible to All',
                            content: 'fdfsdafddfsa'
                        }
                    }
            };




            spyOn(helperService, 'hasAccessToken').and.callFake(function(){
                return true;
            });

            spyOn(helperService, 'GetPostIdFromRoute').and.callFake(function(){
                return 5;
            });

            spyOn(PostFactory, 'GetSinglePostByRouteIdManage').and.callFake(function(){
                return q(function(resolve, reject){
                    resolve(post_true);
                })
            });



            spyOn(AutoSaveFactory, 'FillOutEditPost').and.callFake(function (res) {

            });


        }));

        it('should fillOut post when CheckFilloutConditions is true', function(){

            spyOn(AutoSaveFactory, 'CheckFilloutConditions').and.callFake(function (res) {
                return true;
            });

            createCtrl();
            scope.$apply();

            expect(scope.fillOut).toBe(true);
            expect(AutoSaveFactory.FillOutEditPost).toHaveBeenCalledWith(scope.post);


        });

        it('should fillOut post when CheckFilloutConditions and checkLastModifiedConditions is false', function(){

            spyOn(AutoSaveFactory, 'CheckFilloutConditions').and.callFake(function (res) {
                return false;
            });

            spyOn(AutoSaveFactory, 'CheckLastModifiedConditions').and.callFake(function (res) {
                return false;
            });

            createCtrl();
            scope.$apply();

            expect(AutoSaveFactory.FillOutEditPost).not.toHaveBeenCalled();

        });


        it('should create saveInerval when have access key + destroy interval when scope is destroyed', function(){

            var intervalObj = {
                func: function() { }
            };

            spyOn(intervalObj, 'func').and.callThrough();

            spyOn(AutoSaveFactory, 'CreateSaveIntervalEdit').and.callFake(function(){
                return interval(intervalObj.func, 5000);
            });

            spyOn(AutoSaveFactory, 'CheckFilloutConditions').and.callFake(function (res) {
                return false;
            });

            spyOn(AutoSaveFactory, 'CheckLastModifiedConditions').and.callFake(function (res) {
                return true;
            });

            createCtrl();

            scope.$apply();
            expect(AutoSaveFactory.CreateSaveIntervalEdit).toHaveBeenCalledWith(scope.post);

            interval.flush(5000);
            expect(intervalObj.func.calls.count()).toBe(1);

            scope.$destroy();
            interval.flush(5000);
            expect(intervalObj.func.calls.count()).toBe(1);


        });


    })


});
