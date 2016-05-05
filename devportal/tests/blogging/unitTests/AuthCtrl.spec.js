describe("AuthCtrl", function() {


  var scope;
  var ctrl;
  var token;
  var spy;
  var helperService;
  var LsCacheFactory;
  var Auth;
    var q;
    var httpBackend;
    var RedirectFactory;
    var createController;
    var AuthFactory;
    var AccountFactory;
  beforeEach(module('appInt'));


  describe('Token present', function(){
    beforeEach(inject(function($rootScope, $controller, _$httpBackend_, _$q_, _AuthFactory_, _AccountFactory_, _LsCacheFactory_) {
        token = "access_token=MWBBMFtNngVBE5RY7XyFxGSTlsJ46Yjs&token_type=bearer&expires_in=3600&scope=hybris.product_update hybris.product_unpublish hybris.product_read_unpublished hybris.product_publish hybris.product_delete hybris.product_create";
        scope = $rootScope.$new();
        ctrl = $controller('AuthCtrl',
        {
          $scope: scope,
          token: token
        });
        httpBackend = _$httpBackend_;
        AuthFactory = _AuthFactory_;
        AccountFactory = _AccountFactory_;
        LsCacheFactory = _LsCacheFactory_;
        q = _$q_;

        httpBackend.whenGET('/internal/blog/managing/list.html').respond(200, '');
        httpBackend.whenGET('/blog/list.html').respond(200, '');
        httpBackend.whenGET('%3C%=%20@getOAuthService()%20%3E/authorize?response_type=token&client_id=%3C%=%20@getClientId()%20%3E&scope=hybris.product_delete%20hybris.product_update%20hybris.product_publish%20hybris.product_unpublish%20hybris.product_create%20hybris.product_read_unpublished&redirect_uri=%3C%=%20@getRedirUri()%20%3E').respond(200, []);
        httpBackend.whenGET('<%= @getOAuthService() %>/userinfo').respond(200, '');
        httpBackend.whenGET('<%= @getAccountService() %>/projects/yaasblog/members?pageNumber=1&pageSize=1000&roles=Publisher&totalCount=true').respond(200, '');
    }));


    it('should be authorized when token present ', function(){

        //httpBackend.whenGET('<%= @getOAuthService() %>/userinfo').respond(200, '');

        spyOn(scope, 'saveAuth').and.callFake(function(){

        });
        scope.CheckAuthorize();
        //httpBackend.flush();
        expect(scope.authorized).toBe(true);
        expect(scope.saveAuth).toHaveBeenCalled();
    })

      it('should invoke SetAuthor, SetPublishersUsers on success call of GetAuthor and GetUsersOfRole', function(){



          spyOn(AuthFactory, 'GetAuthor').and.callFake(function(){
              return q(function(resolve, reject){
                  resolve('fsdf');
              })
          });

          spyOn(AccountFactory, 'GetUsersOfRole').and.callFake(function(){
              return q(function(resolve, reject){
                  resolve('fsdf');
              })
          });

          spyOn(LsCacheFactory, 'SetToken').and.callFake(function(){

          });

          spyOn(LsCacheFactory, 'SetScopes').and.callFake(function(){

          });

          spyOn(LsCacheFactory, 'SetAuthor').and.callFake(function(){

          });


          spyOn(LsCacheFactory, 'SetPublisherUsers').and.callFake(function(){

          });

          scope.saveAuth();
          scope.$apply();

          expect(LsCacheFactory.SetToken).toHaveBeenCalled();
          expect(LsCacheFactory.SetScopes).toHaveBeenCalled();
          expect(LsCacheFactory.SetPublisherUsers).toHaveBeenCalled();
          expect(LsCacheFactory.SetAuthor).toHaveBeenCalled();

      })

  })


  //TODO: fix in next sprint

    describe('Token not present', function(){
    beforeEach(inject(function($rootScope, $controller, _RedirectFactory_, $httpBackend) {
        token = undefined;
        scope = $rootScope.$new();
        RedirectFactory = _RedirectFactory_;
        //ctrl = $controller('AuthCtrl',
        //{
        //  $scope: scope,
        //  token: token
        //});
        //
        createController = function(){
            return $controller('AuthCtrl',
                {
                    $scope: scope,
                    token: token
                });
        };
        httpBackend = $httpBackend;
     }));

     it('should be unauthorized when token not present ', function(){

         spyOn(RedirectFactory, 'RedirectToExternalAuthService').and.callFake(function(){
         });

         var ctrl = createController();
         //httpBackend.whenGET('%3C%=%20@getOAuthService()%20%3E/authorize?response_type=token&client_id=%3C%=%20@getClientId()%20%3E&scope=hybris.product_delete%20hybris.product_update%20hybris.product_publish%20hybris.product_unpublish%20hybris.product_create%20hybris.product_read_unpublished&redirect_uri=%3C%=%20@getRedirUri()%20%3E').respond(200, []);
         //httpBackend.whenGET('/blog/list.html').respond(200, '');

         scope.CheckAuthorize();
         //httpBackend.flush();
         expect(scope.authorized).toBe(false);
         expect(RedirectFactory.RedirectToExternalAuthService).toHaveBeenCalled();
    })





   })




});
