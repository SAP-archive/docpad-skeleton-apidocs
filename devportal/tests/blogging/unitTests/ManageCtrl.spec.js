describe('ManageCtrl', function(){

  beforeEach(module('appInt'));


  var scope;
  var ctrl;
  var helperService;
  var PostFactory;
  var q;
  var redirectFactory;

  describe('authorized', function(){

    beforeEach(inject(function($rootScope, $controller, _helperService_, _PostFactory_, $q, _RedirectFactory_){
      scope = $rootScope.$new();
      PostFactory = _PostFactory_;
      helperService = _helperService_;
      q = $q;
      redirectFactory = _RedirectFactory_;
      controller = $controller('ManageCtrl', {
        $scope: scope
      })


      spyOn(PostFactory, 'GetPosts').and.callFake(function(){
        return q(function(resolve, reject){
          resolve("test");
        })
      })
    }))

    it('should invoke PostFactory.GetPosts() on authorized', function(){
      spyOn(helperService, 'hasAccessToken').and.callFake(function(){
        return true;
      })

      scope.initialize();

      expect(PostFactory.GetPosts).toHaveBeenCalled();
      scope.$apply();
      expect(scope.posts).toBe('test');
    })

    it('should redirect to Auth if unauthorized', function(){
      spyOn(helperService, 'hasAccessToken').and.callFake(function(){
        return false;
      })
      spyOn(redirectFactory, 'RedirectToAuth').and.callFake(function(){

      })

      scope.initialize();

      expect(redirectFactory.RedirectToAuth).toHaveBeenCalled();

    })
  })


})
