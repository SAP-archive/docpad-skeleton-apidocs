describe("PostDetailCtrl", function() {


    var scope;
    var ctrl;
    var PostFactory;
    var AuthFactory;
    var LsCacheFactory;
    var helperService;
    var q;
    var rootScope;
    var httpBackend;
    var MessageFactory;

  beforeEach(module('appInt'));

  describe('fail messages', function(){
    beforeEach(inject(function($rootScope, $controller, $q, _PostFactory_, _AuthFactory_, _LsCacheFactory_, _helperService_, _$httpBackend_, _MessageFactory_){
        scope = $rootScope.$new();
        ctrl = function(){
            return $controller('PostDetailCtrl', {
                $scope: scope
            })
        }



        PostFactory = _PostFactory_;
        AuthFactory = _AuthFactory_;
        LsCacheFactory = _LsCacheFactory_;
        helperService = _helperService_;
        q = $q;
        rootScope = $rootScope;
        httpBackend = _$httpBackend_;
        MessageFactory = _MessageFactory_;

        spyOn(LsCacheFactory, 'SetAnonKey').and.callFake(function(){

        });

        spyOn(helperService, 'extractAnonKey').and.callFake(function(){

        });

        spyOn(helperService, 'GetPostIdFromRoute').and.callFake(function(){
            return 5;
        })

        httpBackend.whenGET('<%= @getProductService() %>/yaasblog/products').respond(200,'');
        httpBackend.whenGET('/blog/list.html').respond("ok");
        httpBackend.whenGET('<%= @getProductService() %>/yaasblog/products/5').respond("ok");



    }));


      it('error message to be empty on initialization', function(){
          ctrl();

          expect(scope.errorMessage).toBe('');
      });


      it('proper message on GetSinglePostByRouteId failed (token not present)', function(){
          ctrl();

          spyOn(LsCacheFactory, 'GetAnonToken').and.callFake(function(){
              return false;
          })

          spyOn(AuthFactory, 'GetAnonKey').and.callFake(function(){
              return q(function(resolve, reject){
                  resolve("Jozek");
              })
          })

          spyOn(PostFactory, 'GetSinglePostByRouteId').and.callFake(function(){
              return q(function(resolve, reject){
                  reject("Jozek");
              })
          });

          scope.initialize();
          expect(scope.restCall).toBe(true);

          scope.$apply();
          expect(scope.errorMessage).toBe(MessageFactory.ProductGetFailedOneMessage);
          expect(scope.restCall).toBe(false);

      });

      it('proper message on GetSinglePostByRouteId failed (token present)', function(){
          ctrl();

          spyOn(LsCacheFactory, 'GetAnonToken').and.callFake(function(){
              return true;
          })

          spyOn(PostFactory, 'GetSinglePostByRouteId').and.callFake(function(){
              return q(function(resolve, reject){
                  reject("Jozek");
              })
          });

          scope.initialize();
          expect(scope.restCall).toBe(true);

          scope.$apply();
          expect(scope.errorMessage).toBe(MessageFactory.ProductGetFailedOneMessage);
          expect(scope.restCall).toBe(false);

      });

      it('proper message on GetAnonKey failed', function(){
          ctrl();

          spyOn(LsCacheFactory, 'GetAnonToken').and.callFake(function(){
              return false;
          })

          spyOn(AuthFactory, 'GetAnonKey').and.callFake(function(){
              return q(function(resolve, reject){
                  reject("Jozek");
              })
          });

          scope.initialize();
          expect(scope.restCall).toBe(true);

          scope.$apply();
          expect(scope.errorMessage).toBe(MessageFactory.AnonTokenFailedMessageDetail);
          expect(scope.restCall).toBe(false);

      });

      it('should invoke GetSinglePostByRouteId on authorized state', function(){
        ctrl();

        spyOn(LsCacheFactory, 'GetAnonToken').and.callFake(function(){
          return true;
        })

        spyOn(PostFactory, 'GetSinglePostByRouteId').and.callFake(function(){
          return q(function(resolve, reject){
              reject("Jozek");
          })
        });

        scope.initialize();
        expect(scope.restCall).toBe(true);
        expect(PostFactory.GetSinglePostByRouteId).toHaveBeenCalledWith(5);

        scope.$apply();
        expect(scope.restCall).toBe(false);

      });

      it('should invoke GetAnonToken on unauthorized state', function(){
          ctrl();

          spyOn(LsCacheFactory, 'GetAnonToken').and.callFake(function(){
              return false;
          })

          spyOn(AuthFactory, 'GetAnonKey').and.callFake(function(){
              return q(function(resolve, reject){
                  reject("Jozek");
              })
          });
          scope.initialize();

          expect(scope.restCall).toBe(true);
          expect(AuthFactory.GetAnonKey).toHaveBeenCalled()


      });


  })
})
