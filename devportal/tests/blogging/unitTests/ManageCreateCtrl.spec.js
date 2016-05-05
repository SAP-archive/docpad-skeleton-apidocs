describe('ManageCreateCtrl', function(){


beforeEach(module('appInt'));

  var scope;
  var ctrl;
  var config;
  var helperService;
  var redirectFactory;
  var MetadataFactory;
  var createCtrl;
  var interval;
  var AutoSaveFactory;
  var LsCacheFactory;
  var MessageFactory;

  beforeEach(inject(function($rootScope, $controller, _config_, _helperService_, _RedirectFactory_, _MetadataFactory_, _AutoSaveFactory_, $interval, _LsCacheFactory_, _MessageFactory_) {
      scope = $rootScope.$new();
      ctrl = $controller('ManageCreateCtrl', {$scope: scope});
      createCtrl = function () {
          return $controller('ManageCreateCtrl',
              {
                  $scope: scope
              });
      };
      helperService = _helperService_;
      redirectFactory = _RedirectFactory_;
      config = _config_;
      MetadataFactory = _MetadataFactory_;
      AutoSaveFactory = _AutoSaveFactory_;
      interval = $interval;
      LsCacheFactory = _LsCacheFactory_;
      MessageFactory = _MessageFactory_;

      spyOn(config, 'productSchema').and.returnValue("test");

      spyOn(AutoSaveFactory, 'FillOutCreatePost').and.callFake(function(){

      });

      spyOn(MetadataFactory, 'PreparePostObject').and.callFake(function(){
          return {};
      });

    }));


    it('should action be create on start', function() {

    expect(scope.action).toBe('create');

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

    it('should create saveInerval when have access key + destroy interval when scope is destroyed - createCtrl', function(){

        var intervalObj = {
            func: function() { }
        };

        spyOn(helperService, 'hasAccessToken').and.callFake(function(){
            return true;
        });

        spyOn(intervalObj, 'func').and.callThrough();
        spyOn(AutoSaveFactory, 'CreateSaveIntervalCreate').and.callFake(function(){
            return interval(intervalObj.func, 5000);
        });


        createCtrl();

        expect(AutoSaveFactory.CreateSaveIntervalCreate).toHaveBeenCalledWith(scope.post);

        interval.flush(5000);
        expect(intervalObj.func.calls.count()).toBe(1);

        scope.$destroy();
        interval.flush(5000);
        expect(intervalObj.func.calls.count()).toBe(1);

    });

    it('should invoke FillOutCreatePost on initialization when token present', function(){

        spyOn(helperService, 'hasAccessToken').and.callFake(function(){
            return true;
        });

        spyOn(AutoSaveFactory, 'CreateSaveIntervalCreate').and.callFake(function(){

        });

        createCtrl();

        expect(AutoSaveFactory.FillOutCreatePost).toHaveBeenCalled();

    });

    it('should validAuthor be false when author contains email instead of firstname + lastname', function(){

      spyOn(helperService, 'IsAuthorAsEmail').and.callFake(function(){
        return false;
      });

      spyOn(MessageFactory, 'CreateAuthorWarningMessage').and.callFake(function(){
        return "test";
      });
      
      createCtrl();

      expect(scope.authorMessage).toBe('');

    });

    it('should validAuthor be false when author contains email instead of firstname + lastname', function(){

      spyOn(helperService, 'IsAuthorAsEmail').and.callFake(function(){
        return true;
      });

      spyOn(MessageFactory, 'CreateAuthorWarningMessage').and.callFake(function(){
        return "test";
      });

      createCtrl();

      expect(scope.authorMessage).toBe("test");
    });

});
