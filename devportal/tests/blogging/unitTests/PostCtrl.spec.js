describe("PostlCtrl", function() {


  var scope;
  var ctrl;
  var PostFactory;
  var AuthFactory;
  var LsCacheFactory;
  var helperService;
  var q;
  var route;
  var rootScope;
  var httpBackend;

  beforeEach(module('appInt'));

  describe('initalize on isInternal=false', function(){
    beforeEach(inject(function($rootScope, $controller, $q, $route, _PostFactory_, _AuthFactory_, _LsCacheFactory_, _helperService_, $httpBackend){
        scope = $rootScope.$new();
        ctrl = $controller('PostCtrl', {
          $scope: scope,
          isInternal: false
        })

        PostFactory = _PostFactory_;
        AuthFactory = _AuthFactory_;
        LsCacheFactory = _LsCacheFactory_;
        helperService = _helperService_;
        q = $q;
        rootScope = $rootScope;
        httpBackend = $httpBackend;


        httpBackend.whenGET('<%= @getAccountService() %>/auth/anonymous/login?client_id=%3C%25%3D+@getClientId()+%25%3E&redirect_uri=%3C%25%3D+@getRedirUri()+%25%3E').respond(200,'');
        spyOn(PostFactory, 'GetPostsByAudience').and.callFake(function(){
          return q(function(resolve, reject){
            resolve("Jozek");
          })
        });

        spyOn(LsCacheFactory, 'SetAnonKey').and.callFake(function(){

        });



        spyOn(AuthFactory, 'GetAnonKey').and.callFake(function(){
          return q(function(resolve, reject){
            resolve("Jozek");
          })
        });

        spyOn(helperService, 'extractAnonKey').and.callFake(function(){

        });




    }));

    it('error message to be empty on initialization', function(){
      expect(scope.errorMessage).toBe('');
    })

    it('proper title and audience', function(){

      expect(scope.audience).toBe('?q=mixins.post.audience:"Visible to All"');
      expect(scope.title).toBe('Blog');
    });

    it('should invoke GetPostsByAudience on authorized', function(){

      spyOn(helperService, 'HasAnnonToken').and.callFake(function(){
          return true;
      });


      scope.initialize();
      expect(PostFactory.GetPostsByAudience).toHaveBeenCalledWith(scope.audience);
    });

    it('should invoke AuthFactory.GetAnonKey on unauthorized', function(){

      spyOn(helperService, 'HasAnnonToken').and.callFake(function(){
          return false;
      });
      //httpBackend.when('GET', '<%= @getAccountService() %>/auth/anonymous/login?client_id=%3C%25%3D+@getClientId()+%25%3E&redirect_uri=%3C%25%3D+@getRedirUri()+%25%3E').respond("7Y7c516ojsiHDEifO32Dbuh3hZZwAa0C");

      scope.initialize();
      //scope.$apply();
      expect(AuthFactory.GetAnonKey).toHaveBeenCalled();
    })
  });

  describe('initialize on isInternal = true', function(){
    var scope;
    var ctrl;
    var PostFactory;
    var AuthFactory;
    var LsCacheFactory;
    var helperService;
    var q;
    var route;
    var rootScope;

    beforeEach(inject(function($rootScope, $controller, $q, $route, _PostFactory_, _AuthFactory_, _LsCacheFactory_, _helperService_, _$httpBackend_){
        scope = $rootScope.$new();
        ctrl = $controller('PostCtrl', {
          $scope: scope,
          isInternal: true
        })

        PostFactory = _PostFactory_;
        AuthFactory = _AuthFactory_;
        LsCacheFactory = _LsCacheFactory_;
        helperService = _helperService_;
        q = $q;
        httpBackend = _$httpBackend_;
      }))

      it('proper title and audience', function(){
        expect(scope.audience).toBe('?q=mixins.post.audience:"Visible to Internal Only"');
        expect(scope.title).toBe('Internal Blog');
      })

      it('error message to be empty on initialization', function(){

          expect(scope.errorMessage).toBe('');
      })
  })

    describe('fail messages', function(){
        var scope;
        var ctrl;
        var PostFactory;
        var AuthFactory;
        var LsCacheFactory;
        var helperService;
        var q;
        var route;
        var rootScope;
        beforeEach(inject(function($rootScope, $controller, $q, $route, _PostFactory_, _AuthFactory_, _LsCacheFactory_, _helperService_, _$httpBackend_, _MessageFactory_){
            scope = $rootScope.$new();
            ctrl = function() {
                return $controller('PostCtrl', {
                    $scope: scope,
                    isInternal: true
                })
            }

            PostFactory = _PostFactory_;
            AuthFactory = _AuthFactory_;
            LsCacheFactory = _LsCacheFactory_;
            helperService = _helperService_;
            q = $q;
            httpBackend = _$httpBackend_;
            MessageFactory = _MessageFactory_;

            httpBackend.whenGET('<%= @getAccountService() %>/auth/anonymous/login?client_id=%3C%25%3D+@getClientId()+%25%3E&redirect_uri=%3C%25%3D+@getRedirUri()+%25%3E').respond(200,'');
            httpBackend.whenGET('/blog/list.html').respond("ok");
            httpBackend.whenGET('<%= @getProductService() %>/yaasblog/products?q=mixins.post.audience:"Visible to All"&pageSize=100').respond(200, []);
            httpBackend.whenGET('<%= @getProductService() %>/yaasblog/products?q=mixins.post.audience:"Visible to Internal Only"&pageSize=100').respond(200, []);

        }))

        it('proper fail message on anon token failed', function(){



            var controller = ctrl();

            spyOn(helperService, 'HasAnnonToken').and.callFake(function(){
                return false;
            })

            spyOn(helperService, 'extractAnonKey').and.callFake(function(){
                return true;
            })

            spyOn(PostFactory, 'GetPostsByAudience').and.callFake(function(){
                return q(function(resolve, reject){
                    resolve('fsdf');
                })
            })

            spyOn(AuthFactory, 'GetAnonKey').and.callFake(function(){
                    return q(function(resolve, reject){
                        reject('fdsfd');
                    })
            })


            scope.initialize();
            scope.$apply();
            httpBackend.flush();

            expect(scope.errorMessage).toBe(MessageFactory.AnonTokenFailedMessage);
            expect(scope.restCall).toBe(false);


        })

        it('proper fail message on GetPostByAudience failed when have token + spinner check', function(){

            var controller = ctrl();


            spyOn(helperService, 'HasAnnonToken').and.callFake(function(){
                return true;
            })

            spyOn(helperService, 'extractAnonKey').and.callFake(function(){
                return true;
            })

            spyOn(PostFactory, 'GetPostsByAudience').and.callFake(function(){
                return q(function(resolve, reject){
                    reject('fsdf');
                })
            })

            scope.initialize();
            scope.$apply();
            httpBackend.flush();

            expect(scope.errorMessage).toBe(MessageFactory.ProductGetFailedMessages);
            expect(scope.restCall).toBe(false);

        })

        it('proper fail message on GetPostByAudience failed when dont have token + Spinner check', function(){

            var controller = ctrl();

            spyOn(helperService, 'HasAnnonToken').and.callFake(function(){
                return true;
            })

            spyOn(helperService, 'extractAnonKey').and.callFake(function(){
                return true;
            })

            spyOn(PostFactory, 'GetPostsByAudience').and.callFake(function(){
                return q(function(resolve, reject){
                    reject('fsdf');
                })
            })

            scope.initialize();
            scope.$apply();
            httpBackend.flush();

            expect(scope.errorMessage).toBe(MessageFactory.ProductGetFailedMessages);
            expect(scope.restCall).toBe(false);

        })


    })




})
