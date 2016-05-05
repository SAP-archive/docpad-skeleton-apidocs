describe('factories', function() {


  beforeEach(module('appInt'));

  describe('helperService', function(){
    var helperService;
    var LsCacheFactory;
    var tokenResponse = 'access_token=MWBBMFtNngVBE5RY7XyFxGSTlsJ46Yjs&token_type=bearer&expires_in=3600&scope=hybris.product_update hybris.product_unpublish hybris.product_read_unpublished hybris.product_publish hybris.product_delete hybris.product_create';

    var usersFromRoleResponse = [{
      'firstName' : 'Mariusz',
      'lastName' : 'Jasinski',
      'status' : 'ACTIVE',
      'email' : 'mariusz.jasinski@hybris.com',
      'memberRoles' : [ 'OWNER', 'VIEWER', 'Publisher' ],
      'createdAt' : '2015-05-11T09:52:54.161+0000'
    }, {
      'status' : 'ACTIVE',
      'email' : 'lukasz.przezorski@hybris.com',
      'memberRoles' : [ 'VIEWER', 'Publisher' ],
      'createdAt' : '2015-02-25T10:28:01.807+0000'
    } ];

    var anonTokenResponse = {
      'access_token':'ZNyoOdwe4b7a65xbBEVF6GcP1ON2pkux',
      'expires_in': 3600,
      'token_type':'Bearer',
      'scope':'hybris.tenant=devportalblog',
      'route':'auth/anonymous/login',
      'reqParams':{'client_id':'jNyCDepxNdejbLfIMfI0mLFnOc1KrzOp',
      'redirect_uri':'http://127.0.0.1:9778/internal/blog/index.html'},
      'restangularized':true,
      'fromServer':true,
      'parentResource':null,
      'restangularCollection':false
    };

    var scopeTrue = ['hybris.product_update', 'hybris.product_unpublish', 'hybris.product_read_unpublished', 'hybris.product_publish', 'hybris.product_delete', 'hybris.product_create'];
    var scopeFalse = ['hybris.product_update', 'hybris.product_read_unpublished', 'hybris.product_delete', 'hybris.product_create'];
    var users = ['mariusz.jasinski@hybris.com', 'lukasz.przezorski@hybris.com'];

    beforeEach(inject(function(_helperService_, _LsCacheFactory_) {
      helperService = _helperService_;
      LsCacheFactory = _LsCacheFactory_;
    }));


    it('isAuthorAsEmail should return false when author doesnt contains email', function(){

      spyOn(LsCacheFactory, 'GetAuthor').and.callFake(function(){
        return 'Mr Sample';
      });
      var result = helperService.IsAuthorAsEmail();

      expect(result).toBe(false);
    });

    it('isAuthorAsEmail should return true when author contains email', function(){

      spyOn(LsCacheFactory, 'GetAuthor').and.callFake(function(){
        return 'Mr@Sample.com';
      });
      var result = helperService.IsAuthorAsEmail();

      expect(result).toBe(true);
    });


    it('should extract proper users from response', function(){

      var users = helperService.ExtractUsersFromResponse(usersFromRoleResponse);

      expect(users).toEqual(['mariusz.jasinski@hybris.com', 'lukasz.przezorski@hybris.com']);
    });


    it('should extract proper scopes', function(){

      var scopes = helperService.extractData(tokenResponse, 'scope');

      expect(scopes).toEqual('hybris.product_update hybris.product_unpublish hybris.product_read_unpublished hybris.product_publish hybris.product_delete hybris.product_create');
    });


    it('return true value in isPublisher when proper scopes/users asssigned', function(){

        spyOn(LsCacheFactory, 'GetEmail').and.callFake(function(){
          return 'mariusz.jasinski@hybris.com';
        });

        expect(helperService.IsPublisher(scopeTrue, users)).toBe(true);
      });


    it('return false value in isPublisher when bad scopes assigned', function(){

      spyOn(LsCacheFactory, 'GetEmail').and.callFake(function(){
        return 'mariusz.jasinski@hybris.com';
      });

      expect(helperService.IsPublisher(scopeFalse, users)).toBe(false);
    });


    it('return false value in isPublisher when bad users assigned', function(){
      spyOn(LsCacheFactory, 'GetEmail').and.callFake(function(){
        return 'BadUsers';
      });
      expect(helperService.IsPublisher(scopeTrue, users)).toBe(false);

    });


    it('return true value in isUnPublisher when proper scopes/users asssigned', function(){
      spyOn(LsCacheFactory, 'GetEmail').and.callFake(function(){
        return 'mariusz.jasinski@hybris.com';
      });

      expect(helperService.IsUnPublisher(scopeTrue, users)).toBe(true);

    });

    it('return false value in isUnPublisher when bad scopes asssigned', function(){
      spyOn(LsCacheFactory, 'GetEmail').and.callFake(function(){
        return 'mariusz.jasinski@hybris.com';
      });

      expect(helperService.IsUnPublisher(scopeFalse, users)).toBe(false);

    });


    it('return false value in isUnPublisher when bad users asssigned', function(){
      spyOn(LsCacheFactory, 'GetEmail').and.callFake(function(){
        return 'BadUser';
      });

      expect(helperService.IsUnPublisher(scopeFalse, users)).toBe(false);

    });

    it('hasAccessToken should return true when apiKey and author present', function() {
        spyOn(LsCacheFactory, 'GetToken').and.callFake(function(){
          return 'sample';
        });

        spyOn(LsCacheFactory, 'GetAuthor').and.callFake(function(){
          return 'sample';
        });

        var result = helperService.hasAccessToken();
        expect(result).toBe(true);

      });

    it('hasAccessToken should return false when apiKey is not present', function() {
        spyOn(LsCacheFactory, 'GetToken').and.callFake(function(){
          return '';
        });

        spyOn(LsCacheFactory, 'GetAuthor').and.callFake(function(){
          return 'sample';
        });

        var result = helperService.hasAccessToken();
        expect(result).toBe(false);

      });

    it('hasAccessToken should return false when author is not present', function() {
        spyOn(LsCacheFactory, 'GetToken').and.callFake(function(){
          return 'sample';
        });

        spyOn(LsCacheFactory, 'GetAuthor').and.callFake(function(){
          return '';
        });

        var result = helperService.hasAccessToken();
        expect(result).toBe(false);

      });


    it('should return proper authorname', function() {

        var result = helperService.PrepareAuthor('Mariusz', null);
        expect(result).toBe('Mariusz');

        result = helperService.PrepareAuthor(null, 'Jasinski');
        expect(result).toBe('Jasinski');

        result = helperService.PrepareAuthor('Mariusz', 'Jasinski');
        expect(result).toBe('Mariusz Jasinski');
      });


    it('hasAnnonToken should return true when annonKey is provided', function(){

      spyOn(LsCacheFactory, 'GetAnonToken').and.callFake(function(){
        return true;
      });

      var result = helperService.HasAnnonToken();
      expect(result).toBe(true);
    });


    it('hasAnnonToken should return false when annonKey is not provided', function(){

      spyOn(LsCacheFactory, 'GetAnonToken').and.callFake(function(){
        return false;
      });

      var result = helperService.HasAnnonToken();
      expect(result).toBe(false);
    });

    it('should extract proper token', function(){
      //will change when we change version of services to b1 (product)
      var result = helperService.extractData(tokenResponse, 'access_token');
      expect(result).toBe('MWBBMFtNngVBE5RY7XyFxGSTlsJ46Yjs');

    });

    it('should extract proper anon token', function(){
    //will change when we change version of services to b1 (product)
      var result = helperService.extractAnonKey(anonTokenResponse);
      expect(result).toBe('ZNyoOdwe4b7a65xbBEVF6GcP1ON2pkux');

    });

  });

  describe('AuthFactory', function(){

    var AuthFactory;
    var AccountFactory;
    var httpBackend;
    var q;
    var helperService;


    var userInfoResponse = {
      sub : 'mariusz.jasinski@hybris.com',
      tenant : 'devportalblog'
    };

    var firstLastNameResponseFiled= {
      firstName: 'Mariusz',
      lastName: 'Jasinski'
    };

    var firstLastNameResponseNotFilled = {
      firstName: '',
      lastName: ''
    };



    beforeEach(inject(function(_AuthFactory_, _AccountFactory_, _helperService_, $httpBackend, $q) {
      AuthFactory = _AuthFactory_;
      AccountFactory = _AccountFactory_;
      httpBackend = $httpBackend;
      helperService = _helperService_;
      q = $q;

      httpBackend.when('GET', '/blog/list.html').respond('');

    }));



    it('should return firstname and lastname as author when provided', function(){

      httpBackend.when('GET', '<%= @getOAuthService() %>/userinfo').respond(userInfoResponse);

      spyOn(AccountFactory, 'GetFirstLastName').and.callFake(function(){
        return q(function(resolve, reject){
          resolve(firstLastNameResponseFiled);
        });
      });

      spyOn(helperService, 'PrepareAuthor').and.callFake(function(name, lastname){
        return name + ' ' +lastname;
      });

      var author;
      AuthFactory.GetAuthor().then(function(result){
        author = result;
      });
      httpBackend.flush();

      expect(author).toBe('Mariusz Jasinski');
    });

    it('should return mail as author when firstname and lastname not provided', function(){

      httpBackend.when('GET', '<%= @getOAuthService() %>/userinfo').respond(userInfoResponse);
      spyOn(AccountFactory, 'GetFirstLastName').and.callFake(function(){
        return q(function(resolve, reject){
          resolve(firstLastNameResponseNotFilled);
        });
      });

      spyOn(helperService, 'PrepareAuthor').and.callFake(function(name, lastname){
        return name + ' ' +lastname;
      });


      var author;
      AuthFactory.GetAuthor().then(function(result){
        author = result;
      });
      httpBackend.flush();

      expect(author).toBe('mariusz.jasinski@hybris.com');

    });


    it('should return anonKey when provided', function(){
      httpBackend.when('GET', '<%= @getAccountService() %>/auth/anonymous/login?client_id=%3C%25%3D+@getClientId()+%25%3E&redirect_uri=%3C%25%3D+@getRedirUri()+%25%3E').respond('7Y7c516ojsiHDEifO32Dbuh3hZZwAa0C');
      var token;
      AuthFactory.GetAnonKey().then(function(response){
        token = response;
      });
      httpBackend.flush();
      expect(token).toBe('7Y7c516ojsiHDEifO32Dbuh3hZZwAa0C');

    });

  });


  describe('AccountFactory', function(){
      var accountFactory;
      var restAngularService;
      var httpBackend;

      var firstLastNameResponse = {
        firstName: 'Mariusz',
        lastName: 'Jasinski'
      };
      beforeEach(inject(function(_AccountFactory_, _restAngularService_, $httpBackend){
        accountFactory = _AccountFactory_;
        restAngularService = _restAngularService_;
        httpBackend = $httpBackend;
      }));

      it('should return firstName and lastname with response as provided', function() {
        httpBackend.when('GET', '<%= @getAccountService() %>/accounts/test').respond(firstLastNameResponse);

        httpBackend.when('GET', '/blog/list.html').respond('');

        var fName;
        var lName;

        accountFactory.GetFirstLastName('test').then(function(response){
            fName = response.firstName;
            lName = response.lastName;
          });
        httpBackend.flush();

        expect(fName).toBe(firstLastNameResponse.firstName);
        expect(lName).toBe(firstLastNameResponse.lastName);

      });
    });

  describe('Metadatafactory', function(){

    var Metadatafactory;
    var LsCacheFactory;
    var config;

    beforeEach(inject(function(_MetadataFactory_, _LsCacheFactory_, _config_) {
        Metadatafactory = _MetadataFactory_;
        LsCacheFactory = _LsCacheFactory_;
        config = _config_;

        spyOn(LsCacheFactory, 'GetAuthor').and.callFake(function(){
          return 'Jozek';
        });

        spyOn(config, 'productSchema').and.callFake(function(){
          return 'SchemaJozka';
        });


      }));

    it('should have defined proper metadata', function(){

      var obj = Metadatafactory.PreparePostObject();

      expect(obj.metadata).toBeDefined();
      expect(obj.mixins).toBeDefined();
      expect(obj.mixins.post.author).toBe('Jozek');
      expect(obj.mixins.post.date).toEqual(jasmine.any(String));
      expect(obj.mixins.post.date).toBeIso8601();
      expect(obj.metadata.mixins.post).toBe('SchemaJozka');


    });

  });

  var AutoSaveFactory;
  var LsCacheFactory;
  var helperService;
  var interval;
  var config;
  var httpBackend;
  describe('AutoSaveFactorys', function(){

        beforeEach(inject(function(_AutoSaveFactory_, _LsCacheFactory_, _helperService_, $interval, _config_, $httpBackend) {
            AutoSaveFactory = _AutoSaveFactory_;
            LsCacheFactory = _LsCacheFactory_;
            helperService = _helperService_;
            interval = $interval;
            config = _config_;
            httpBackend = $httpBackend;
          }));

        var initialValue = {
          mixins: {
            name: 'Test',
            post: {
              content: 'TestContent',
              audience: 'TestAudience',
              tag: 'TestTag'
            }
          }
        };

        var lsCachePost = {
          name: 'TestCache',
          content: 'TestContentCahe',
          audience: 'TestAudienceCache',
          tag: 'TestTagCache',
          modifiedAt: '2015-05-28T14:53:07.215+0000'
        };

        var lsCachePostEqual = {
          name: 'equal',
          content: 'equal',
          audience: 'equal',
          tag: 'equal',
          id: 5,
          modifiedAt: '2015-05-28T14:53:07.215+0000'
        };

        var postEqual = {
          mixins: {
            name: 'equal',
            post: {
              content: 'equal',
              audience: 'equal',
              tag: 'equal',
              id: 5
            }
          },
          metadata: {
            modifiedAt: '2015-05-28T14:53:07.215+0000'
          }
        };

        var post = {
          mixins: {
            name: '',
            post: {
              content: '',
              audience: '',
              tag: ''
            }
          }
        };

        var postLastModifiedTrue = {
          mixins: {
            name: '',
            post: {
              content: '',
              audience: '',
              tag: '',
              id: 5
            }
          },
          metadata: {
            modifiedAt: '2015-04-28T14:53:07.215+0000'
          }
        };

        var postLastModifiedFalse = {
          mixins: {
            name: '',
            post: {
              content: '',
              audience: '',
              tag: '',
              id: 50
            }
          },
          metadata: {
            modifiedAt: '2015-08-28T14:53:07.215+0000'
          }
        };

        it('correct fill out edit post object with initial value provided', function(){

            AutoSaveFactory.FillOutEditPost(post, initialValue);

            expect(post.mixins.post.content).toBe(initialValue.mixins.post.content);
            expect(post.mixins.post.audience).toBe(initialValue.mixins.post.audience);
            expect(post.mixins.post.tag).toBe(initialValue.mixins.post.tag);
            expect(post.name).toBe(initialValue.name);

          });

        it('correct fill out edit post object', function(){

            spyOn(LsCacheFactory, 'GetTempEditPost').and.callFake(function(){
                return lsCachePost;
              });

            AutoSaveFactory.FillOutEditPost(post);

            expect(post.mixins.post.content).toBe(lsCachePost.content);
            expect(post.mixins.post.audience).toBe(lsCachePost.audience);
            expect(post.mixins.post.tag).toBe(lsCachePost.tag);
            expect(post.name).toBe(lsCachePost.name);

          });

        it('correct fill out create post object', function(){

            spyOn(LsCacheFactory, 'GetTempCreatePost').and.callFake(function(){
                return lsCachePost;
              });

            AutoSaveFactory.FillOutCreatePost(post);

            expect(post.mixins.post.content).toBe(lsCachePost.content);
            expect(post.mixins.post.audience).toBe(lsCachePost.audience);
            expect(post.mixins.post.tag).toBe(lsCachePost.tag);
            expect(post.name).toBe(lsCachePost.name);

          });

        it('checkModifiedConditions should return false pt 1', function(){

            spyOn(LsCacheFactory, 'GetTempEditPost').and.callFake(function(){
                return lsCachePost;
              });

            spyOn(helperService, 'GetPostIdFromRoute').and.callFake(function(){
              return 5;
            });

            var result = AutoSaveFactory.CheckLastModifiedConditions(postLastModifiedTrue);

            expect(result).toBe(false);
          });

        it('checkModifiedConditions should return true pt 2', function(){
            spyOn(LsCacheFactory, 'GetTempEditPost').and.callFake(function(){
                return '';
              });

            spyOn(helperService, 'GetPostIdFromRoute').and.callFake(function(){
              return 5;
            });

            var result = AutoSaveFactory.CheckLastModifiedConditions(postLastModifiedFalse);

            expect(result).toBe(false);
          });

        it('checkModifiedConditions should return false pt 1', function(){
            spyOn(LsCacheFactory, 'GetTempEditPost').and.callFake(function(){
                return lsCachePost;
              });

            spyOn(helperService, 'GetPostIdFromRoute').and.callFake(function(){
              return 5;
            });

            var result = AutoSaveFactory.CheckLastModifiedConditions(postLastModifiedFalse);

            expect(result).toBe(false);
          });

        it('checkFilloutConditions should return false pt1 (temp_obj false)', function(){

            spyOn(LsCacheFactory, 'GetTempEditPost').and.callFake(function(){
                return '';
              });

            spyOn(helperService, 'GetPostIdFromRoute').and.callFake(function(){
              return 5;
            });

            spyOn(AutoSaveFactory, 'CheckLastModifiedConditions').and.callFake(function(){
              return true;
            });

            var result = AutoSaveFactory.CheckFilloutConditions(postLastModifiedTrue);

            expect(result).toBe(false);
          });

        it('checkFilloutConditions should return false pt2 ( CheckLastModifiedConditions false)', function(){

            spyOn(LsCacheFactory, 'GetTempEditPost').and.callFake(function(){
                return lsCachePost;
              });

            spyOn(helperService, 'GetPostIdFromRoute').and.callFake(function(){
                return 5;
              });

            spyOn(AutoSaveFactory, 'CheckLastModifiedConditions').and.callFake(function(){
                return false;
              });


            var result = AutoSaveFactory.CheckFilloutConditions(postLastModifiedTrue);

            expect(result).toBe(false);
          });

        it('checkFilloutConditions should return false pt3 (id isnt equal)', function(){

            spyOn(LsCacheFactory, 'GetTempEditPost').and.callFake(function(){
                return lsCachePost;
              });

            spyOn(helperService, 'GetPostIdFromRoute').and.callFake(function(){
                return 5;
              });

            spyOn(AutoSaveFactory, 'CheckLastModifiedConditions').and.callFake(function(){
                return true;
              });

            var result = AutoSaveFactory.CheckFilloutConditions(postLastModifiedFalse);

            expect(result).toBe(false);
          });

        it('checkFilloutConditions should return false pt3 (objEqual is true)', function(){

            spyOn(LsCacheFactory, 'GetTempEditPost').and.callFake(function(){
                return lsCachePostEqual;
              });

            spyOn(helperService, 'GetPostIdFromRoute').and.callFake(function(){
                return 5;
              });

            spyOn(AutoSaveFactory, 'CheckLastModifiedConditions').and.callFake(function(){
                return true;
              });

            var result = AutoSaveFactory.CheckFilloutConditions(postEqual);

            expect(result).toBe(true);
          });

        it('checkFilloutConditions should return true (all cond true ;) )', function(){

            spyOn(LsCacheFactory, 'GetTempEditPost').and.callFake(function(){
                return lsCachePost;
              });

            spyOn(helperService, 'GetPostIdFromRoute').and.callFake(function(){
                return 5;
              });

            spyOn(AutoSaveFactory, 'CheckLastModifiedConditions').and.callFake(function(){
                return true;
              });

            var result = AutoSaveFactory.CheckFilloutConditions(postLastModifiedTrue);

            expect(result).toBe(false);
          });


        it('Checking create interval if works', function(){
            httpBackend.whenGET('/blog/list.html').respond(200, '');

            spyOn(config, 'AutoSaveInterval').and.callFake(function(){
                return 5000;
              });

            spyOn(LsCacheFactory, 'SetTempCreatePost').and.callFake(function(){

            });

            var saveInterval = AutoSaveFactory.CreateSaveIntervalCreate(post);

            interval.flush(5000);
            expect(LsCacheFactory.SetTempCreatePost.calls.count()).toBe(1);
            interval.flush(5000);
            expect(LsCacheFactory.SetTempCreatePost.calls.count()).toBe(2);

          });

        it('Checking edit interval if works', function(){
            httpBackend.whenGET('/blog/list.html').respond(200, '');

            spyOn(config, 'AutoSaveInterval').and.callFake(function(){
                return 5000;
              });

            spyOn(LsCacheFactory, 'SetTempEditPost').and.callFake(function(){
                return ;
              });

            spyOn(helperService, 'GetPostIdFromRoute').and.callFake(function(){
                return 5;
              });

            var saveInterval = AutoSaveFactory.CreateSaveIntervalEdit(post);

            interval.flush(5000);
            expect(LsCacheFactory.SetTempEditPost.calls.count()).toBe(1);
            interval.flush(5000);
            expect(LsCacheFactory.SetTempEditPost.calls.count()).toBe(2);

          });

      });

});
