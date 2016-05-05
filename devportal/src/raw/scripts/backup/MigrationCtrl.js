'use strict'

app.controller('MigrationCtrl', ['$scope', 'Restangular', function($scope, Restangular){

  $scope.urlSource = 'https://api.yaas.io/hybris/product/b1/';
  $scope.tenantSource = 'yaasblog'
  var finalPathSource = $scope.tenantSource + '/products';

  $scope.urlDestination = 'https://api.yaas.io/hybris/product/b1/';
  $scope.tenantDestination = 'yaasblog'
  var finalPathDestination = $scope.tenantDestination + '/products';

  $scope.staffUrlSource = 'https://api.yaas.io/hybris/account/b1/projects/';
  $scope.staffTenantSource = 'yaasblog';
  var finalStaffUrlSource = $scope.staffTenantSource + '/members';

  $scope.staffUrlDestination = 'https://api.stage.yaas.io/hybris/account/b1/projects/';
  $scope.staffTenantDestination = 'yaasblog';
  var finalStaffUrlDestination = $scope.staffTenantDestination + '/members';


  $scope.staffApiKey_source = '';
  $scope.staffApiKey_destination = '';

  $scope.apiKey_source = '';
  $scope.apiKey_destination = '';

  var sourceProducts = [];
  $scope.successNumber = 0;
  $scope.errorNumber = 0;
  $scope.failedObjects = [];


  var createPost = function(obj){
    return {
      metadata: {
        mixins: {
          post: obj.metadata.mixins.post
        }
      },
      mixins: {
        post: {
          audience: obj.mixins.post.audience,
          author: obj.mixins.post.author,
          content: obj.mixins.post.content,
          date: obj.mixins.post.date,
          tag: obj.mixins.post.tag,
          published: false
        }
      },
      name: obj.name
    };

  };

  var migrationBasedSource =  function() {
      return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl($scope.urlSource);
        RestangularConfigurer.setDefaultHeaders({ Authorization: 'Bearer '+ $scope.apiKey_source });
        RestangularConfigurer.setRestangularFields({
            id: 'id'
        });

        return RestangularConfigurer;
    });
}

  var migrationBasedDestination =  function() {
      return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl($scope.urlDestination);
        RestangularConfigurer.setDefaultHeaders({ Authorization: 'Bearer '+ $scope.apiKey_destination });
        RestangularConfigurer.setRestangularFields({
            id: 'id'
        });

        return RestangularConfigurer;
    });
  };

  var migrationStuffBasedSource = function(){
      return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl($scope.staffUrlSource);
        RestangularConfigurer.setDefaultHeaders({ Authorization: 'Bearer '+ $scope.staffApiKey_source });
        RestangularConfigurer.setRestangularFields({
            id: 'id'
        });

        return RestangularConfigurer;
    });
  };

  var migrationStuffBasedDestination = function(){
      return Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl($scope.staffUrlDestination);
        RestangularConfigurer.setDefaultHeaders({ Authorization: 'Bearer '+ $scope.staffApiKey_destination });
        RestangularConfigurer.setRestangularFields({
            id: 'id'
        });

        return RestangularConfigurer;
    });
  };


  var addPost = function(body){
    var destinationBased = migrationBasedDestination();
    return destinationBased.all(finalPathDestination).post(body);

  };

  var putPost = function(body){
    var destinationBased = migrationBasedDestination();
    return destinationBased.all(finalPathDestination).customPUT(body, undefined, undefined);

  };

  var getAllPosts = function(){
    var sourceBased = migrationBasedSource();
    return sourceBased.all(finalPathSource).getList({pageSize: 1000});
  };
  var deletePost = function(id){
    var sourceBased = migrationBasedSource();
    return sourceBased.one(finalPathDestination + '/' + id).remove();
  }
  //GET https://api.yaas.ninja/hybris/account/b1/projects/devportalblog/members?pageNumber=1&pageSize=5&totalCount=true
  //https://api.yaas.ninja/hybris/account/b1/projects/devportalblog/members/lukasz.gornicki@hybris.com

  var getAllUsers = function(project){
    var sourceBased = migrationStuffBasedSource();
    return sourceBased.all(finalStaffUrlSource).getList({pageSize: 1000});
  };

  var addStaffToProject = function(user){
    var desinationBased =  migrationStuffBasedDestination();
    var body = {
      membersRoles: ['VIEWER']
    };

    return desinationBased.all(finalStaffUrlDestination + '/' + user.email).customPUT(body, undefined, undefined);
  };

  var addAllStaffToProject = function(users){
      angular.forEach(users, function(user){
          addStaffToProject(user).then(function(){
            $scope.successNumberStuff++;

          }, function(res){
            $scope.errorNumberStaff++;
            $scope.failedObjects.push(res.config.data);
          });
      });
  };

$scope.failedObjectsStuff = [];
  var AddAllPosts = function(objects) {

    angular.forEach(objects, function(el){
        var body = createPost(el);
        //addPost(body).then(function(res){
        console.log(el.metadata.mixins.post);
        addPost(body).then(function(res){
          $scope.successNumber++;
        }, function(res){
          $scope.errorNumber++;
          $scope.failedObjectsStuff.push(res.config.data);
        });
    });

  };

  var DeleteAllPosts = function(objects) {

    angular.forEach(objects, function(el){
        deletePost(el.id).then(function(res){
          //$scope.successNumber++;
        }, function(res){
          //$scope.errorNumber++;
          //$scope.failedObjectsStuff.push(res.config.data);
        });
    });

  };

  $scope.AddFailedOnes = function(){
    $scope.successNumber = 0;
    $scope.errorNumber = 0;
    $scope.totalNumber = $scope.failedObjects.length;
    var objectToAdd = angular.copy($scope.failedObjects);
    $scope.failedObjects = [];

    AddAllPosts(objectToAdd);

  };

  $scope.AddFailedStuffOnes = function(){
    $scope.successNumberStuff = 0;
    $scope.errorNumberStuff = 0;
    $scope.totalNumberStuff = $scope.failedObjectsStuff.length;
    var objectToAdd = angular.copy($scope.failedObjects);
    $scope.failedObjects = [];

    addAllStaffToProject(objectToAdd);
  }

  $scope.migrate = function() {

       AddAllPosts(arr);
      //   getAllPosts().then(function(res){
      //     console.log(res);
      //     DeleteAllPosts(res);
      //  });
  };

  $scope.migrateStaff = function(){
    getAllUsers().then(function(res){
      var users = res;
      console.log(users.length);
      $scope.totalNumberStuff = users.length;
      addAllStaffToProject(users);

    });
  };




var arr =
[ {
  "sku" : "SystemDemo71430232766561",
  "name" : "System Demo 7",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-04-28T14:53:07.215+0000",
    "modifiedAt" : "2015-04-28T14:53:07.215+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-04-28T14:51:54.354Z",
      "author" : "lukasz.gornicki@hybris.com",
      "content" : "<p>We just had our system demo. It was awesome and we&#39;ve presented a lot of new cool stuff and improvements.</p>\n\n<p>Soon we will share with you its recording!</p>\n\n<p>&nbsp;</p>\n\n<p>Stay tuned!</p>\n\n<p>Chewie and the YaaS team</p>\n\n<p>&nbsp;</p>\n\n<p>P.S. If you would like to contribute to our donation for the Nepal Disaster Relief program, please visit&nbsp;<a href=\"https://nepal.yaas.io\">https://nepal.yaas.io</a></p>\n",
      "audience" : "Visible to All",
      "tag" : "News and Events"
    }
  },
  "id" : "553f9ebe6a6e9c9c038bc49f"
}, {
  "sku" : "GoodByeapicfhybriscompatterns1431951093804",
  "name" : "Good Bye api.cf.hybris.com/patterns",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-05-18T12:12:03.936+0000",
    "modifiedAt" : "2015-05-18T12:12:03.936+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-05-18T12:01:11.256Z",
      "author" : "andreas.thaler@hybris.com",
      "content" : "<p>It is time to say good bye to the <a href=\"http://api.cf.hybris.com/patterns\">outdated URL</a> for the <a href=\"https://devportal.yaas.io/tools/ramlpatterns/index.html\">RAML patterns</a>. It is switched off and will not be available anymore.</p>\n\n<p>Please use <a href=\"https://api.yaas.io/patterns\">https://api.yaas.io/patterns</a> always.</p>\n",
      "audience" : "Visible to All",
      "tag" : "Migrations"
    }
  },
  "id" : "5559d6f6374ea5f9596aab8c"
}, {
  "sku" : "Definitionofservicesonstagearegone1432201809949",
  "name" : "Definitions of services on stage are gone",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-05-21T09:51:02.563+0000",
    "modifiedAt" : "2015-05-21T09:51:02.563+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-05-21T09:42:26.950Z",
      "author" : "piotr.bochynski@hybris.com",
      "content" : "<p>Today during some maintenance tasks service difinitions on stage environment have been erased. We are working on restoring them but unfortunatelly the last usable backup is 3 weeks old. I will update this information when restore procedure is finished. Please do not recreate services in builder until I send the information that backup is restored.&nbsp;</p>\n\n<p>I am really sorry for that.</p>\n\n<p>Piotr</p>\n",
      "tag" : "Post-Mortems",
      "audience" : "Visible to Internal Only"
    }
  },
  "id" : "555daa51acce048c99ca8838"
}, {
  "sku" : "Lostsometrustedapplicationsdata1437732620287",
  "name" : "Lost some trusted applications data [2015-07-24 12:00]",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-07-24T10:14:38.293+0000",
    "modifiedAt" : "2015-07-24T10:14:38.293+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-07-24T10:05:48.159Z",
      "author" : "marek.paprota@hybris.com",
      "content" : "<p>Todays 10 min outage of builder was caused by changed data&nbsp;of trusted applications.</p>\n\n<p>We managed to use a backup to restore everything, but if you have some problems, please contact team toad.</p>\n\n<p>Sorry for any&nbsp;inconveniences.</p>\n\n<p>Marek</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Post-Mortems"
    }
  },
  "id" : "55b20f1666ee922ea386055e"
}, {
  "sku" : "Test1438000909540",
  "name" : "Test",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "version" : 1,
    "createdAt" : "2015-07-27T12:41:49.563+0000",
    "modifiedAt" : "2015-07-27T12:41:49.563+0000"
  },
  "mixins" : {
    "post" : {
      "date" : "2015-07-27T12:42:27.981Z",
      "author" : "mariusz.jasinski@hybris.com",
      "content" : "<p>fdggfd</p>\n",
      "audience" : "Visible to All",
      "tag" : "News and Events"
    }
  },
  "id" : "55b6270d2eee34205345e88f"
}, {
  "sku" : "AccountV1isshutdownonPRODSTAGE1438175329822",
  "name" : "Account V1 is shut down on PROD & STAGE",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-07-29T13:09:09.021+0000",
    "modifiedAt" : "2015-07-29T13:09:09.021+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-07-29T13:04:16.139Z",
      "author" : "tomasz.smelcerz@hybris.com",
      "content" : "<p>Hi!</p>\n\n<p>Team Toad is shutting down account-v1 for good. It was announced long time ago here: <a href=\"https://devportal.yaas.io/internal/blog/post/5548ab63feae1e94801cb727\" target=\"_blank\">https://devportal.yaas.io/internal/blog/post/5548ab63feae1e94801cb727</a></p>\n\n<p>&nbsp;</p>\n\n<p>Kind Regards,</p>\n\n<p>Team Toad</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "News and Events"
    }
  },
  "id" : "55b8d061a96eb999f878e136"
}, {
  "sku" : "Welcome1429707319021",
  "name" : "Welcome",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-04-22T12:55:32.076+0000",
    "modifiedAt" : "2015-04-22T12:55:32.076+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-04-22T12:54:34.185Z",
      "author" : "lukasz.gornicki@hybris.com",
      "content" : "<p>Hello,</p>\n\n<p>Welcome to our new Blog section where you can see all posts about thing happening on YaaS, except of release notes.<br />\nFor more details read latest Dev Portal release notes:&nbsp;<a href=\"https://devportal.yaas.io/rn/tools/devportal/2015-04-22-NewDevPortalRelease018.html\">https://devportal.yaas.io/rn/tools/devportal/2015-04-22-NewDevPortalRelease018.html</a></p>\n\n<p>Yours,<br />\nTeam Wookiee</p>\n",
      "audience" : "Visible to All",
      "tag" : "News and Events"
    }
  },
  "id" : "55379a37078e2f7219913656"
}, {
  "sku" : "Welcome1429707355677",
  "name" : "Welcome",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-04-22T12:56:07.921+0000",
    "modifiedAt" : "2015-04-22T12:56:07.921+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-04-22T12:55:33.779Z",
      "author" : "lukasz.gornicki@hybris.com",
      "content" : "<p>Hi peepal,</p>\n\n<p>Welcome to our new Blog section where you can see all posts about YaaS that should be visible to internal only.<br />\nIf you want to write a post click on Manage Posts button.<br />\nAnyway the best way to get details is to read our release notes:&nbsp;<a href=\"https://devportal.yaas.io/internal/rn/tools/devportal/2015-04-22-NewDevPortalRelease018.html\">https://devportal.yaas.io/internal/rn/tools/devportal/2015-04-22-NewDevPortalRelease018.html</a></p>\n\n<p>Cheers and let the force be with you<br />\nTeam Wookiee</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "News and Events"
    }
  },
  "id" : "55379a5b34eeabc8157b6f82"
}, {
  "sku" : "SiteSettingsandCouponServicesb1proxiesnowavailable1429889499423",
  "name" : "Site Settings and Coupon Services b1 proxies now available!",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-04-27T09:58:50.034+0000",
    "modifiedAt" : "2015-04-27T09:58:50.034+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-04-24T15:29:36.539Z",
      "author" : "dana.roibu@hybris.com",
      "content" : "<p>Hi All,</p>\n\n<p>Please take note that Site Settings Service and&nbsp;&nbsp;Coupon Service are now available via&nbsp;<strong>b1</strong>&nbsp;proxies, as follows:</p>\n\n<p>In&nbsp;<strong>Stage </strong>environment:</p>\n\n<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<em>Stable versions:</em></p>\n\n<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<a href=\"https://api.stage.yaas.io/hybris/site-settings/b1\">https://api.stage.yaas.io/hybris/site-settings/b1</a></p>\n\n<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<a href=\"https://api.stage.yaas.io/hybris/coupon/b1\">https://api.stage.yaas.io/hybris/coupon/b1</a></p>\n\n<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<em>&nbsp;SNAPSHOT versions:</em></p>\n\n<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<a href=\"https://api.stage.yaas.io/hybris/site-settings/dev-b1\">https://api.stage.yaas.io/hybris/site-settings/dev-b1</a></p>\n\n<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<a href=\"https://api.stage.yaas.io/hybris/coupon/dev-b1\">https://api.stage.yaas.io/hybris/coupon/dev-b1</a></p>\n\n<p>In <strong>Prod</strong> environment:</p>\n\n<p>&nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<a href=\"https://api.yaas.io/hybris/site-settings/b1\">https://api.yaas.io/hybris/site-settings/b1</a></p>\n\n<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<a href=\"https://api.yaas.io/hybris/coupon/b1\">https://api.yaas.io/hybris/coupon/b1</a></p>\n",
      "tag" : "Migrations",
      "audience" : "Visible to Internal Only"
    }
  },
  "id" : "553a61db7aee869502f4b098"
}, {
  "sku" : "SiteSettingsandCouponServicesb1proxiesnowavailable1430128111614",
  "name" : "Site Settings and Coupon Services b1 proxies now available!",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-04-27T09:48:54.820+0000",
    "modifiedAt" : "2015-04-27T09:48:54.820+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-04-27T09:46:32.020Z",
      "author" : "dana.roibu@hybris.com",
      "content" : "<p>Hi All,</p>\n\n<p>Please take note that Site Settings Service and&nbsp;&nbsp;Coupon Service are now available via&nbsp;<strong>b1</strong>&nbsp;proxies, as follows:</p>\n\n<p>&nbsp;</p>\n\n<p><a href=\"https://api.yaas.io/hybris/site-settings/b1\">&nbsp;https://api.yaas.io/hybris/site-settings/b1</a></p>\n\n<p><a href=\"https://api.yaas.io/hybris/coupon/b1\">&nbsp;https://api.yaas.io/hybris/coupon/b1</a></p>\n",
      "tag" : "Migrations",
      "audience" : "Visible to All"
    }
  },
  "id" : "553e05ef364ed4bb8806aacc"
}, {
  "sku" : "Accountv1APIchanges1430821620370",
  "name" : "Account v1 API changes",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-05-05T10:55:39.960+0000",
    "modifiedAt" : "2015-05-05T10:55:39.960+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-05-05T10:16:11.280Z",
      "author" : "piotr.kopczynski@hybris.com",
      "content" : "<p>hi team,</p>\n\n<p>today, team toad has narrowed down the account v1&nbsp;API resources to:</p>\n\n<p><strong>/openid</strong></p>\n\n<p><strong>/auth</strong></p>\n\n<p>Cheers, Piotr Kopczynski</p>\n\n<p>&nbsp;</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Migrations"
    }
  },
  "id" : "55489af4dc6eb08c5c049f69"
}, {
  "sku" : "Oauth2v1upcomingshutdown1430822189585",
  "name" : "OAuth2 v1 shutdown July 15th",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-05-26T13:56:11.273+0000",
    "modifiedAt" : "2015-05-26T13:56:11.273+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-05-05T10:29:41.311Z",
      "author" : "piotr.kopczynski@hybris.com",
      "content" : "<p>Hello,</p>\n\n<p>OAuth2 v1 will be shut down on&nbsp;15th of July, 2015.&nbsp;</p>\n\n<p>Until that time, please migrate to the newest version of oauth2 proxy:</p>\n\n<ul>\n\t<li><strong>https://api.yaas.io/hybris/oauth2/v2</strong></li>\n</ul>\n\n<p>Cheers, team Toad</p>\n",
      "audience" : "Visible to All",
      "tag" : "Migrations"
    }
  },
  "id" : "55489d2dccce4d34eaa54b3e"
}, {
  "sku" : "Acountv1shutdowninsixmonths1430825826818",
  "name" : "Account v1 shutdown July 15th",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-05-26T13:57:00.001+0000",
    "modifiedAt" : "2015-05-26T13:57:00.001+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-05-05T11:34:54.066Z",
      "author" : "piotr.kopczynski@hybris.com",
      "content" : "<p>Hello,</p>\n\n<p><strong>15.07.2015&nbsp;</strong>is the&nbsp;day&nbsp;when&nbsp;the account&nbsp;v1 service&nbsp;on stage and prod will not be available anymore:</p>\n\n<ul>\n\t<li>https://api.stage.yaas.io/account/v1</li>\n\t<li>https://api.yaas.io/account/v1</li>\n</ul>\n\n<p>Until that time, please migrate to the newest version of account proxy:</p>\n\n<ul>\n\t<li><strong>https://api.stage.yaas.io/hybris/account/v2</strong></li>\n\t<li><strong>https://api.yaas.io/hybris/account/v2</strong></li>\n</ul>\n\n<p>Cheers, team toad</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Migrations"
    }
  },
  "id" : "5548ab63feae1e94801cb727"
}, {
  "sku" : "PubSubv0goingoutofservice1431434896846",
  "name" : "PubSub v0 going out of service",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-05-12T12:59:34.874+0000",
    "modifiedAt" : "2015-05-12T12:59:34.874+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-05-12T12:00:10.235Z",
      "author" : "jakub.haase@hybris.com",
      "content" : "<p>Hello,</p>\n\n<p>we&#39;d like to remind you&nbsp;that PubSub v0 will go&nbsp;out of service by&nbsp;the end of this week. Version 1 will be the only one we publish our events to&nbsp;until we finish our integration&nbsp;with PubSub b2.</p>\n\n<p>Cheers, Jakub</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Migrations"
    }
  },
  "id" : "5551f691226e4101b22ffbcc"
}, {
  "sku" : "GreatdealofnewsfromFramefrogs1431609333556",
  "name" : "Great deal of news from Framefrogs!",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-05-18T08:49:52.418+0000",
    "modifiedAt" : "2015-05-18T08:49:52.418+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-05-14T13:05:27.420Z",
      "author" : "michal.kusztelak@hybris.com",
      "content" : "<p>Hi All!</p>\n\n<p>I&#39;d like to share with you latest information from Framefrogs.&nbsp;</p>\n\n<p>As you all know Open Beta is coming to us very soon and with this, we have to introduce some changes in the nearest future.</p>\n\n<p>First of all, Framefrogs&#39; services in version <strong>v2</strong>&nbsp;will not be available any longer. Moreover, with Open Beta we will have <strong>b1</strong>&nbsp;and <strong>b2</strong>&nbsp;versions of our services, but <strong>b1</strong>&nbsp;is deprecated and will be terminated in four weeks.</p>\n\n<p>As it comes to <strong>b2</strong>&nbsp;I need to tell something more about that. Why <strong>b2</strong>? It has introduced scopes for view, manage in our services.&nbsp;<br />\nYou can find more about scopes in our documentation, e.g. <a href=\"https://devportal.yaas.io/services/documentrepository/b1/index.html#Scopes\">https://devportal.yaas.io/services/documentrepository/b1/index.html#Scopes&nbsp;</a></p>\n\n<p>Another topic is access to our services without proxy. Yes, this is the end of No Proxy Era - in four weeks we want to secure direct access to our services.</p>\n\n<p>However, there is still hope for Core Teams. If you are in great need of an access to Framefrogs&#39; services without proxy, please make a request to us for credentials.</p>\n\n<p>As a reminder: direct access is allowed&nbsp;for <strong>Core Services only</strong>, Commerce Services are required to use proxy as stated in jira <a href=\"https://jira.hybris.com/browse/YAAS-277\">YAAS-277</a>.</p>\n\n<p>It is a lot of changes in very near future, please follow our updates on topics mentioned above.</p>\n\n<pre>\nLive long and prosper\n\n             .-T |   _\n             | | |  / |\n             | | | / /`|\n          _  | | |/ / /\n          \\`\\| &#39;.&#39; / /\n           \\ \\`-. &#39;--|\n            \\    &#39;   |\n             \\  .`  /\n              |    |</pre>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Engineering"
    }
  },
  "id" : "55549ff6bd8eccb8fc1c6222"
}, {
  "sku" : "ProductProductDetailsCategoryandmoreb1serviceproxiesnowavailable1432192177574",
  "name" : "Product, Product Details, Category and more b1 service proxies now available!",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-05-21T08:42:00.045+0000",
    "modifiedAt" : "2015-05-21T08:42:00.045+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-05-21T07:06:04.493Z",
      "author" : "daniel.poloczek@hybris.com",
      "content" : "<p>Hi All,</p>\n\n<p>Please take a note that Product, Product Details, Category, Shipping Cost and PCM Services are now available via <strong>b1 proxies</strong>, as follows:</p>\n\n<p><a href=\"https://api.yaas.io/hybris/product/b1\">https://api.yaas.io/hybris/product/b1</a></p>\n\n<p><a href=\"https://api.yaas.io/hybris/product-details/b1\">https://api.yaas.io/hybris/product-details/b1</a></p>\n\n<p><a href=\"https://api.yaas.io/hybris/category/b1\">https://api.yaas.io/hybris/category/b1</a></p>\n\n<p><a href=\"https://api.yaas.io/hybris/shipping-cost/b1\">https://api.yaas.io/hybris/shipping-cost/b1</a></p>\n\n<p><a href=\"https://api.yaas.io/hybris/pcm/b1\">https://api.yaas.io/hybris/pcm/b1</a></p>\n\n<p>We&nbsp;recommend migrating to these proxies before Open Beta (27th of May).&nbsp;</p>\n",
      "tag" : "Migrations",
      "audience" : "Visible to All"
    }
  },
  "id" : "555d84b2eb0e108b16724373"
}, {
  "sku" : "Goodbyejavajettybuildpack1432212642881",
  "name" : "Good bye java_jetty_buildpack",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-05-21T12:51:11.497+0000",
    "modifiedAt" : "2015-05-21T12:51:11.497+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-05-21T12:46:07.432Z",
      "author" : "andrea.stubbe@hybris.com",
      "content" : "<p>Due to the latest issues with our buildpacks (in particular our java_jetty_buildpack), we came to the realization, that we cannot deliver our forked and adapted buildpacks in the same quality and the same frequent update cycles as the cloud foundry community does. If you are wondering why? Here some simple comparison for the java buildpack:</p>\n\n<p>YaaS - (at best) 0.01 x Idefix members : Cloud Foundry Community - (mostly full time) 17 x Commiter!</p>\n\n<p>&nbsp;<img src=\"https://wiki.hybris.com/download/thumbnails/274872563/g22b.gif?version=1&amp;modificationDate=1432166223000&amp;api=v2\" style=\"margin:0px 2px; width:100px\" /></p>\n\n<p>I would say that&#39;s a pretty unfair ratio. And pretty nutty to believe we can do this. But, at the end we became reasonable and are stopping this insanity. Therefore we all kindly ask you to <strong>not use our java_jetty_buildpack anymore</strong>. No worries, we will not delete it right away from cloud foundry. But you should be aware that it will be gone with the next cloud foundry update, which is only <strong>some weeks</strong> away. We&#39;ll post an update here. We also do not recommend to use the external git URL to reference this buildpack.</p>\n\n<p><strong>You should instead use the&nbsp;<a href=\"https://github.com/cloudfoundry/java-buildpack\">https://github.com/cloudfoundry/java-buildpack</a></strong>&nbsp;(I recommend to read the doc, this thing is a eierlegendewollmilchsau). We currently have the latest version of it installed on our cloud foundries (java_buildpack -&gt; java-buildpack-offline-v3.0.zip). You should reference it with java_buildpack in your manifest. If you don&#39;t trust us that we don&#39;t update it in a timely manner, you also reference it with the git URL. This has only some downside, that this monster gets downloaded everytime you deploy your app (not very fast).</p>\n\n<p>Team Idefix</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Migrations"
    }
  },
  "id" : "555dd4a3ccaecde3a817234f"
}, {
  "sku" : "Servicesdefinitionslostonstagepostmortem1432234824540",
  "name" : "Services definitions lost on stage - post mortem",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-05-21T19:08:19.753+0000",
    "modifiedAt" : "2015-05-21T19:08:19.753+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-05-21T18:21:05.835Z",
      "author" : "piotr.bochynski@hybris.com",
      "content" : "<p>Today during maintanance tasks on stage environment we had lost data of all service definitions on stage environment. We have managed to restore them, but unfortunatelly the last usable backup was 3 weeks old.&nbsp;</p>\n\n<p>Therefore if you have modified or created service on stage environment during last 3 weeks,&nbsp;you are kindly requested to recreate it Builder. If you have any problems with that and need some assistance please create Jira ticket in Toad project, and we will help you in that task. We are really sorry for the problems we have introduced.</p>\n\n<p><strong>Analysis</strong></p>\n\n<p>The root cause was a mistake made by one of our developers. It happened&nbsp;during task to prepare&nbsp;migration scripts directly on document repository. &nbsp;</p>\n\n<p><strong>What we&#39;ve learned</strong></p>\n\n<ol>\n\t<li>We cannot postpone any more task to create automatic regular backup of account data. It is now a &quot;must have&quot; for Open Beta</li>\n\t<li>We cannot run experiments on stage any more - we can copy stage data to another tenant and use it for migration tasks.</li>\n\t<li>Unsecured direct access to document repository is a huge risk. Operation that was executed didn&#39;t require any credentials except having access to SAP network.</li>\n</ol>\n\n<p>Best Regards,</p>\n\n<p>Piotr &amp; Toads</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Post-Mortems"
    }
  },
  "id" : "555e2b48d10ed05c07f74fd1"
}, {
  "sku" : "RunSimpleEmbraceYourMESS1432557588823",
  "name" : "Run Simple - Embrace Your MESS",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-05-25T12:40:56.172+0000",
    "modifiedAt" : "2015-05-25T12:40:56.172+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-05-25T12:38:03.929Z",
      "author" : "adam.suflida@hybris.com",
      "content" : "<p>Is your cf space messy ?<br />\nAre you using too many resources ?<br />\nIs it difficult for you to find proper version of application ?<br />\nAre you using blue-green deployment ?</p>\n\n<p>If You have answered &quot;true&quot; for any of the above questions - this post is for YOU.</p>\n\n<p><a href=\"http://kerrifargo.com/wp-content/uploads/2013/02/fear-of-change.jpg\"><img src=\"http://kerrifargo.com/wp-content/uploads/2013/02/fear-of-change.jpg\" style=\"height:250px; margin:0px 2px\" /></a></p>\n\n<p><strong>DO NOT FEAR OF CHANGE - CHANGE IS GOOD</strong>&nbsp;;)</p>\n\n<p>It&#39;s really easy to embrace Your Mess - just use below plugin to forget about it:</p>\n\n<p>group: &#39;com.hybris.core.framefrog&#39;,<br />\nname: &#39;framefrog-gradle-plugin&#39;,<br />\nversion: &#39;0.0.7&#39;</p>\n\n<ul>\n\t<li>You can scale down inactive variant automatically using scaleDownInactiveVariantToOneInstance task</li>\n\t<li>You can stop inactive variant automatically using stopInactiveVariantInstances task</li>\n</ul>\n\n<p>If You have any questions do not hesitate to contact framefrog or storks teams.</p>\n\n<p>Regards<br />\nAdam</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Engineering"
    }
  },
  "id" : "55631815d10ed05c07f75332"
}, {
  "sku" : "NewDocumentationforRESTBestPractices1436820388697",
  "name" : "New Documentation for REST Best Practices",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-07-13T20:50:06.673+0000",
    "modifiedAt" : "2015-07-13T20:50:06.673+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-07-13T20:06:49.797Z",
      "author" : "kristi.herd@hybris.com",
      "content" : "<p>Recently, the content from the <a href=\"https://devportal.yaas.io/overview/\">REST Best Practices</a> was migrated from the Wiki to the Overview section in the Dev Portal. There are a lot of topics covered here,&nbsp;and more will be added soon. If you have any technical questions about how to incorporate these best practices, contact Andreas Thaler.</p>\n",
      "tag" : "News and Events",
      "audience" : "Visible to Internal Only"
    }
  },
  "id" : "55a423a47d4e63c7dc41eb2e"
}, {
  "sku" : "DevPortalonAWSinternalv21438943748118",
  "name" : "Dev Portal on AWS! [internal] [update]",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-08-07T13:18:10.191+0000",
    "modifiedAt" : "2015-08-07T13:18:10.191+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-08-07T10:25:57.834Z",
      "author" : "lukasz.przezorski@sap.com",
      "content" : "<p>Hello YaaS!</p>\n\n<p>From now on, to log in to the Dev Portal on AWS, please use your CROWD login and password (wiki/JIRA credentials).</p>\n\n<p>Cheers,</p>\n\n<p><em>The Wookiees</em></p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "News and Events"
    }
  },
  "id" : "55c48a04cb6e87045c69cd5c"
}, {
  "sku" : "Migration1432197507031",
  "name" : "Migration to the new Account Service",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-05-21T15:20:17.020+0000",
    "modifiedAt" : "2015-05-21T15:20:17.020+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-05-21T08:35:18.925Z",
      "author" : "ulrike.schullerus@hybris.com",
      "content" : "<p><span class=\"marker\"><strong>Please read this blog post thoroughly and carefully. We introduced some big changes, and there is action required from your side (see the &quot;Tasks for you&quot; section)</strong></span></p>\n\n<p>When thinking about the way how we publish services, we figured out some conceptual issues. Because the beta is meant for learning and improving, this is what we&#39;re doing, by introducing <strong>new versions of the Account and OAUth2 APIs.</strong></p>\n\n<p><strong>Improvements</strong></p>\n\n<ol>\n\t<li>What we call&nbsp;an&nbsp;<em>app</em>&nbsp;is actually a&nbsp;<em>client</em>. When you create something which calls other services in the Builder, you technically create a <em>client</em> for APIs, not an <em>app</em>. We already say the credentials are the client ID and client secret, and by renaming the header to &quot;hybris-client&quot;, we are being consistent. We don&#39;t even remember why we called it an app in the first place :) However, this is only the technical side. When you sit down after work and want to do something fun, you don&#39;t say, &ldquo;Let&#39;s consume some APIs!&quot; (maybe &ldquo;Let&#39;s consume some&nbsp;<a href=\"http://de.wikipedia.org/wiki/India_Pale_Ale\">IPAs</a>&quot;). Instead, you want to develop some kind of application. In the Builder, the respective actions are still called, &ldquo;Create a service, Builder module, or application&quot;. The service or application you develop, comes in two different flavors: single- or multi-tenant. Which means, you either develop a service for your own project, or you publish a service for others, like in the team section of the Builder. The nice, human readable name of the client used is therefore either&nbsp;<em>&lt;project-id&gt;.client_name</em>, or&nbsp;<em>&lt;team-id&gt;.client_name</em>. Note that technically both are tenants, and that the client names within one tenant have to be unique, to ensure overall uniqueness. Note that the hybris-client header is not propagated through call chains, but is set for each <em>hop</em>. Imagine one single-tenant-application calling the order service (hop 1), calling the document repository (hop 2). Then, the respective values of the hybris-client header are&nbsp;<em>owl.mobile_app</em>&nbsp;(hop 1) and&nbsp;<em>hybris.order_service</em>(hop 2).</li>\n\t<li>We renamed the hybris-roles header to hybris-scopes, to be more precise.</li>\n\t<li>Services should include the name of the publisher. Right now, it is not included. The first person who publishes a product service wins. This opens up fun new ways of earning money, such as registering all cool .com domains and reselling them. You can do the same with services ;), but that&#39;s not what we want. From now on, we include the team name in the path. For example,&nbsp;<a href=\"http://api.yaas.io/products\">api.yaas.io/products</a>&nbsp;becomes&nbsp;<a href=\"http://api.yaas.io/hybris/products\">api.yaas.io/hybris/products</a>. This requires some actions from your side, which you can do in the Builder.</li>\n\t<li>We have noticed that our teams often ask for naming conventions for scopes, or recommendations on how to implement checking them. So we introduced a schema for naming scopes, and a way how to check scopes directly at the proxy. It&rsquo;s pretty cool.</li>\n</ol>\n\n<p><strong>Tasks for you</strong></p>\n\n<ul>\n\t<li>If you are using scopes to protect access to your services, rename them according to the new conventions: &lt;team_id&gt;.&lt;service_name&gt;_&lt;scope&gt;.</li>\n\t<li>If you do not have scopes yet, we highly recommend that you specify those in the Services section in the Builder.</li>\n\t<li>The hybris services have been migrated to the new naming schema, so you must adjust your code in all the places that request access tokens, and require those new scopes.</li>\n\t<li>Publish your new API proxy in the Builder, and add them to the packages you had before. As the base path will change to include the team name as well, think about which team name you want to have. Adding the base path enables you to change the version number. This gives you the possibility to reset and go live with v1. To do this, publish your new proxy as &quot;b1&quot;, and all the following versions as &ldquo;b2&quot;, &ldquo;b3&quot;, and so on. Use v1 when you want to go live. In your code, adjust to the new headers the OAuth2 proxy is sending:&nbsp;\n\t<ul>\n\t\t<li>Change the hybris-roles header to hybris-scopes</li>\n\t\t<li>Change the hybris-app header to hybris-client.</li>\n\t</ul>\n\t</li>\n\t<li>To test if your new API proxy works, get an access token using the OAUth2/v2 service, and use it to make a call to the new API proxy.</li>\n\t<li>Once you migrated your services, adjust your&nbsp;UIs calling them to use the OAuth2 services to get an access token.</li>\n\t<li>The Core and Commerce services are already migrated (the <em>b versions</em>), and once you start using them, you must ensure the data of your projects is migrated as well. The reason is that the client-header, previously the app-header, is used to separate data, and this value has changed. Please create a ticket in&nbsp;<a href=\"https://jira.hybris.com/browse/CFB\">https://jira.hybris.com/browse/CFB</a>&nbsp;if you require a migration. As this means work for us, limit this to projects actually in use, and not all you have ever created. Maybe now is a good time to delete all of your old, unused projects ;)</li>\n</ul>\n\n<p><br />\nPlease note that during the migration period, there might be some confusion, but here are some simple rules to help understand what&#39;s happening:</p>\n\n<ul>\n\t<li>API proxies created with account/v1 can only be called using access tokens, or client credentials acquired with version 1.</li>\n\t<li>API proxies created with account/v2 can only be called using access tokens, or client credentials acquired with version 2.</li>\n\t<li>The client credentials you currently have for your projects are created with version 1. The ones you get using the new applications section in the Builder are created with version 2.</li>\n\t<li>Any scenario where you need both tokens for v1 and v2, will not work during the migration period. We know that this is a bad situation, but there is no way around it - and we&#39;re still in the beta!</li>\n</ul>\n\n<p>The old versions of the services will be deprecated on the <span class=\"marker\">15th of July</span>!</p>\n\n<p>If you have questions, please ask them in hybris experts (https://experts.hybris.com/spaces/102/index.html)</p>\n\n<p>Your YaaS team</p>\n",
      "audience" : "Visible to All",
      "tag" : "Migrations"
    }
  },
  "id" : "555d998359ce92ce759c2e1e"
}, {
  "sku" : "CloudFoundryOutOfMemoryhowtomanageit1432645189985",
  "name" : "Cloud Foundry Out Of Memory - how to manage it",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-07-02T10:41:22.958+0000",
    "modifiedAt" : "2015-07-02T10:41:22.958+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-05-26T12:25:27.080Z",
      "author" : "piotr.mscichowski@hybris.com",
      "content" : "<p>In Team Toad we have recently identified a problem with an application instance consuming all allocated memory, which caused Account failure. It happenes, for example, when we run auto refreshing on api-console, i.e. once per 2 sec. After thorough investigation we found out that by default Java_Buildpack is configured to allocate Xmx &amp; Xms to ~ 768 MB of memory per instance.</p>\n\n<p><strong>How we checked it : </strong></p>\n\n<pre>\n<code class=\"language-bash\">cf files {app-name} {directory to your log file }</code></pre>\n\n<p>in our case it was :</p>\n\n<pre>\n<code class=\"language-bash\">cf files {app-name} app/.java-buildpack.log</code></pre>\n\n<p>Below there's a code snippet showing default configuration:</p>\n\n<pre>\n<code class=\"language-bash\">default_process_types:\n\nweb: JAVA_HOME=$PWD/.java-buildpack/open_jdk_jre JAVA_OPTS=\"-Djava.io.tmpdir=$TMPDIR -XX:OnOutOfMemoryError=$PWD/.java-buildpack/open_jdk_jre/bin/killjava.sh -Xmx768M -Xms768M -XX:MaxMetaspaceSize=107546K -XX:MetaspaceSize=107546K -Xss1M -Daccess.logging.enabled=false -Dhttp.port=$PORT\" $PWD/.java-buildpack/tomcat/bin/catalina.sh run\n</code></pre>\n\n<p>On this configuration, when app crashed, we could only observe the following entries in our logs:</p>\n\n<pre>\n<code class=\"language-bash\">[API] OUT App instance exited with guid {guid} payload:\n\n{\"cc_partition\"=&gt;\"default\", \"droplet\"=&gt;\"{droplet}\", \"version\"=&gt;\"{version}\", \"instance\"=&gt;\"{instance}\", \"index\"=&gt;1, \"reason\"=&gt;\"CRASHED\", \"exit_status\"=&gt;255, \"exit_description\"=&gt;\"out of memory\", \"crash_timestamp\"=&gt;1432129588}</code></pre>\n\n<p>As you can see the exit_status state was \"out of memory\".</p>\n\n<p>Please note that values with {} are skipped to make the log shorter.</p>\n\n<p><strong>What we did to solve it:</strong></p>\n\n<p>We lowered the <strong>Xmx</strong> and <strong>Xms</strong> value to <strong>~522MB</strong></p>\n\n<p>To achieve this, we followed java build pack documentation. You can find it here:<br />\n<strong><em>https://github.com/cloudfoundry/java-buildpack/blob/master/docs/jre-oracle_jre.md#configuration</em></strong></p>\n\n<p>As described in the docu file, we set <strong>cf env</strong> <strong>JBP_CONFIG_OPEN_JDK_JRE</strong> value using <strong><em>'memory_heuristics'</em></strong> and its internal property <strong><em>'heap'</em></strong>.</p>\n\n<p>Documentation reads: <em>\"The maximum heap size to use. It may be a single value such as 64m or a range of acceptable values such as 128m..256m. It is used to calculate the value of the Java command line options -Xmx and -Xms.\"</em></p>\n\n<p>Example command to achieve this:</p>\n\n<pre>\n<code class=\"language-bash\">cf set-env your-application JBP_CONFIG_OPEN_JDK_JRE '[version: 1.7.0_+, memory_heuristics: {heap: 85, stack: 10}]'</code></pre>\n\n<p>Our configuration looked like this:</p>\n\n<pre>\n<code class=\"language-bash\">default_process_types:\n\nweb: JAVA_HOME=$PWD/.java-buildpack/open_jdk_jre JAVA_OPTS=\"-Djava.io.tmpdir=$TMPDIR -XX:OnOutOfMemoryError=$PWD/.java-buildpack/open_jdk_jre/bin/killjava.sh -Xmx537731K -Xms537731K -XX:MaxMetaspaceSize=107546K -XX:MetaspaceSize=107546K -Xss1M -Daccess.logging.enabled=false -Dhttp.port=$PORT\" $PWD/.java-buildpack/tomcat/bin/catalina.sh run\n</code></pre>\n\n<p><strong style=\"line-height: 1.6;\">What the result was:</strong></p>\n\n<p>When the app crashed we observed that there was a corresponding application log entry produced in CF, it looked like that:</p>\n\n<pre>\n<code class=\"language-bash\">[App/1] OUT # java.lang.OutOfMemoryError: Java heap space\n[App/1] OUT # -XX:OnOutOfMemoryError=\"/home/vcap/app/.java-buildpack/open_jdk_jre/bin/killjava.sh\"\n[App/1] OUT # Executing /bin/sh -c \"/home/vcap/app/.java-buildpack/open_jdk_jre/bin/killjava.sh\"...\n</code></pre>\n\n<p><span style=\"line-height: 1.6;\">We also observed that CF noticed that instance stoped responding and produceed the following log entry:</span></p>\n\n<pre>\n<code class=\"language-bash\">[API] OUT App instance exited with guid {guid} payload:\n{\"cc_partition\"=&gt;\"default\", \"droplet\"=&gt;\"{droplet}\", \"version\"=&gt;\"{version}\", \"instance\"=&gt;\"{instance}\", \"index\"=&gt;1, \"reason\"=&gt;\"CRASHED\", \"exit_status”=&gt;255, \"exit_description\"=&gt;\"app instance exited\", \"crash_timestamp\"=&gt;1432131583}\n</code></pre>\n\n<p><span style=\"line-height: 1.6;\">Notice that the status: \"</span><strong style=\"line-height: 1.6;\">app instance exited</strong><span style=\"line-height: 1.6;\">\" is different than \"</span><strong style=\"line-height: 1.6;\">out of memory</strong><span style=\"line-height: 1.6;\">\" reported previously.</span></p>\n\n<p><strong>Conclusion: </strong></p>\n\n<p>We were not able to find out what exactly caused the memory allocation exceeding 1GB quota. What we suspect, is that on cloud foundry machine there is a group of processes in which one of them is JVM process. We are not able to make further investigation which of the processes is causing memory consumption as we don’t have access to that machine. &nbsp;JVM + process_X(or processes) consume more and more memory = 1GB quota exceeding.</p>\n\n<p>Once we lowered maximum JVM heap size, we could see proper OutOfMemoryError log entries. This happens because JVM heap size is exceeding faster its memory than group of process altogether.</p>\n\n<p>If you have any questions, please write to us on hipchat or via email (team-toad@sap.com)</p>\n\n<p>&nbsp;</p>\n\n<p>Best Regards,</p>\n\n<p>Team-Toad</p>\n",
      "tag" : "Engineering",
      "audience" : "Visible to Internal Only"
    }
  },
  "id" : "55646e45bfae3692072f0490"
}, {
  "sku" : "ImportantnewsYaaSnotreadyfortheOpenBeta1432650509410",
  "name" : "Important news: YaaS not ready for the Open Beta",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-05-26T15:50:24.215+0000",
    "modifiedAt" : "2015-05-26T15:50:24.215+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-05-26T13:58:37.932Z",
      "author" : "andrea.stubbe@hybris.com",
      "content" : "<p><img class=\"left\" src=\"https://wiki.hybris.com/download/thumbnails/274872185/not-ready1.jpg?version=1&amp;modificationDate=1432157042000&amp;api=v2\" style=\"margin:0px 2px; width:200px\" />&nbsp;</p>\n\n<h3>We are getting closer and closer to our Open Beta Milestone date, but sadly the stability of our environments is not where it needs to be.</h3>\n\n<p>Our goal for the Open Beta is to learn to scale our solution and to onboard more and more people onto YaaS. This only makes sense if everything is stable and fast&nbsp;enough, so that customers have a good experience using our services and implementing their own solutions on top of it. And we&#39;re just not ready for this.</p>\n\n<h2>How to continue?&nbsp;Stability is key!</h2>\n\n<p>Our main focus and highest priority is to hunt down the main stability problems and to find the root cause (or causes?). We identified three main issues:</p>\n\n<ul>\n\t<li>Unreliable network communication</li>\n\t<li>Unreliable services aka 503 Service unavailable problem</li>\n\t<li>Unreliable network infrastructure</li>\n</ul>\n\n<p>Each of those issues is worked on by a temporary tag team, led by Andreas Bucksteeg, Michael Stephan and Rene Welches. You see, we put our best people on fixing this, and also work with the guys from Monsoon.</p>\n\n<h2>How you can help</h2>\n\n<p>We currently try to reduce load on the environments, and stabilize all the services. To help us doing so, it would be great if you could:</p>\n\n<ul>\n\t<li>switch to the standard java buildpack, instead of the jetty buildpack which is provided by team Idefix. You can find it on CloudFoundry, as&nbsp;java-buildpack-offline-v3.0.zip</li>\n\t<li>don&#39;t run any performance or load tests on any of the environemnts</li>\n\t<li>tidy up your CloudFoundry spaces and delete all of those test services, and really old versions you don&#39;t need anymore. Also consider scaling down to 3 instances of a service.</li>\n\t<li>remove your test projects: as each tenant means one Mongo database, please delete your test projects and teams</li>\n</ul>\n\n<h2>So - when <strong>is</strong><em> </em>the Open Beta?</h2>\n\n<p>Sad answer is: <strong>We do not know</strong>. As we can not predict when the environments are back to stable, we can&#39;t realisticly set a new date. Subscribe to this Blog to be notified about updates!</p>\n\n<p>We really wish we could have started the Open Beta as we planned, and are sorry for the delay and instabilities.</p>\n\n<p>Andreas, Klaus and Andrea</p>\n",
      "tag" : "News and Events",
      "audience" : "Visible to Internal Only"
    }
  },
  "id" : "5564830d09cefeef5b6c1855"
}, {
  "sku" : "StabilityProblemsonYaaS1432727981187",
  "name" : "Stability Problems on YaaS",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-05-27T13:48:41.288+0000",
    "modifiedAt" : "2015-05-27T13:48:41.288+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-05-27T11:42:13.016Z",
      "author" : "andrea.stubbe@hybris.com",
      "content" : "<h3>During the last weeks, we&#39;re experiencing serious performance and stability problems on our environments.</h3>\n\n<p>In the past few weeks, we tried scaling&nbsp;our solution, and were planning to onboard more and more people onto YaaS. We realize&nbsp;that&nbsp;this only makes sense if everything is stable and fast&nbsp;enough, so that customers have a good experience using our services and implementing their own solutions on top of it. And we&#39;re just not ready for this.</p>\n\n<h2>How to continue?&nbsp;Stability is key!</h2>\n\n<p>Our main focus and highest priority is to hunt down the main stability problems and to find the root cause (or causes?). We identified three main issues:</p>\n\n<ul>\n\t<li>Unreliable network communication</li>\n\t<li>Unreliable services aka 503 Service unavailable problem</li>\n\t<li>Unreliable loggin infrastructure</li>\n</ul>\n\n<p>Each of those issues is worked on by a temporary tag team, consisting of our best engineers, and pairing with people from the network and infrastructure teams.</p>\n\n<p><img alt=\"We are looking for the bottleneck.\" src=\"http://i.dailymail.co.uk/i/pix/2014/01/07/article-2535302-1A77AEB500000578-32_634x327.jpg\" style=\"border-style:solid; border-width:0px; height:164px; width:317px\" /></p>\n\n<p><em>We are looking for the bottleneck.</em></p>\n\n<h2>How you can help</h2>\n\n<p>We currently try to reduce load on the environments, and stabilize all the services. To help us doing so, it would be great if you could:</p>\n\n<ul>\n\t<li>not run any performance or load tests on YaaS</li>\n\t<li>remove your test projects: as each tenant means one Mongo database, please delete your test projects and teams</li>\n</ul>\n\n<h2>What&#39;s the timeline?</h2>\n\n<p>Sad answer is:&nbsp;<strong>We do not know</strong>. As we can not predict when the environments are back to stable, we can&#39;t realisticly set a new date. Subscribe to this Blog to be notified about updates!</p>\n\n<p>We are sorry for the delay and instabilities, but are confident that we will see major improvements in the near future.</p>\n\n<p>Andreas, Klaus and Andrea</p>\n",
      "audience" : "Visible to All",
      "tag" : "News and Events"
    }
  },
  "id" : "5565b1ad562e4d8442a5702f"
}, {
  "sku" : "EndOfLifeforemailv3andconfigurationv3v41432736230775",
  "name" : "End Of Life for configuration v3",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-06-08T11:18:41.658+0000",
    "modifiedAt" : "2015-06-08T11:18:41.658+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-05-27T14:11:34.750Z",
      "author" : "andreas.thaler@hybris.com",
      "content" : "<p><strong>12.06.2015&nbsp;</strong>is the&nbsp;day&nbsp;when configuration v3&nbsp;service&nbsp;on prod will not be available anymore:</p>\n\n<ul>\n\t<li>https://api.yaas.io/configuration/v3</li>\n</ul>\n\n<p>Until that time, please migrate to the newest version of the services:</p>\n\n<ul>\n\t<li><strong>https://api.yaas.io/hybris/configuration/b1</strong></li>\n</ul>\n\n<p>Yours Team Banananas</p>\n",
      "tag" : "Migrations",
      "audience" : "Visible to All"
    }
  },
  "id" : "5565d1e6bfae3692072f078e"
}, {
  "sku" : "YaaSStatusPage1432889591794",
  "name" : "YaaS Status Page",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-06-17T07:35:12.052+0000",
    "modifiedAt" : "2015-06-17T07:35:12.052+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-05-29T08:45:20.026Z",
      "author" : "lukasz.gornicki@hybris.com",
      "content" : "<p>Hi,</p>\n\n<p>Good news today. We launched a new web site to display the availablility YaaS. It is independent&nbsp;from YaaS, so even if whole YaaS goes down (including the Dev Portal) this page will be operational and show what is wrong.</p>\n\n<p>You can access it from SAP and hybris network with the following links:&nbsp;<a href=\"http://status.yaas.io/\">http://status.yaas.io/</a>&nbsp;and&nbsp;<a href=\"http://status.stage.yaas.io/\">http://status.stage.yaas.io/</a></p>\n\n<p>Regards,</p>\n\n<p>Lukasz</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "News and Events"
    }
  },
  "id" : "556828f9562e4d8442a576d6"
}, {
  "sku" : "AccountV2unabletogetnewaccesstokenonApril4th1433764180992",
  "name" : "Account v2 - unable to get new access token on June 4th",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-06-09T06:16:41.809+0000",
    "modifiedAt" : "2015-06-09T06:16:41.809+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-06-08T11:34:08.062Z",
      "author" : "marek.paprota@hybris.com",
      "content" : "<p>On thursday, no one was able to get an access token from account service. There was an issue with our redis instance on Monsoon machines. All access tokens are saved there.</p>\n\n<p><strong>Analysis </strong></p>\n\n<p>It turned out that <strong>/var</strong> catalog (we save our snapshots in <strong>/var/lib/redis/6379</strong>) was remounted as read-only disk. This probably happened around 04 Jun 02:40 - 04 Jun 02:45 because snapshots are saved every 5 mins and these are last log entries:</p>\n\n<pre>\n[47317] 04 Jun 02:40:26.069 * 10 changes in 300 seconds. Saving...\n[47317] 04 Jun 02:40:26.071 * Background saving started by pid 53476​\n\n</pre>\n\n<p>/proc/mounts file shows that /var is in read-only mode:</p>\n\n<pre>\n/dev/mapper/vg0-var /var ext4 ro,noatime,barrier=1,data=ordered,discard 0 0\n</pre>\n\n<p>but when we list mounts using &#39;mount&#39; we get information that /var is mounted in read-write mode</p>\n\n<pre>\n/dev/mapper/vg0-var on /var type ext4 (rw,noatime,discard)\n</pre>\n\n<p><br />\nHow the system behaved when I tried to create folder in catalog with /var?</p>\n\n<pre>\n$ pwd\n\n/var/lib/redis/6379\n\n$ sudo mkdir test\n\nmkdir: cannot create directory `test&#39;: Read-only file system\n</pre>\n\n<p>&nbsp;</p>\n\n<p>Redis was able to create snapshots in e.g. my home catalog (with write access).</p>\n\n<p><strong>What we did to solve this problem?</strong></p>\n\n<p>We changed&nbsp;config setting:</p>\n\n<pre>\nstop-writes-on-bgsave-error&nbsp;no\n</pre>\n\n<p>By default Redis will stop accepting writes if RDB snapshots are enabled (at least one save point) and the latest background save failed. <strong>Yes</strong> flag makes the user aware (in a hard way) that data is not persisting on disk properly, otherwise chances are that no one will notice and some disaster will happen.</p>\n\n<p><strong>What are next steps?</strong></p>\n\n<p>- raise a ticket about problems with disks&nbsp;on Monsoon&nbsp;machines. We cannot do anything more.</p>\n\n<p>Cherrs,</p>\n\n<p>Marek &amp; Toads</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Post-Mortems"
    }
  },
  "id" : "557581559a6e313ebf0c4237"
}, {
  "sku" : "DocumentRepositoryunavailableonJune4th1433770259719",
  "name" : "Document Repository unavailable on June 4th",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-06-15T07:47:53.425+0000",
    "modifiedAt" : "2015-06-15T07:47:53.425+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-06-08T13:01:10.530Z",
      "author" : "damian.jureczko@hybris.com",
      "content" : "<p style=\"line-height: 20.7999992370605px;\">On Thursday, 4th of June we had a serious failure of our MongoDB Replica Set for Document Repository. At the moment it was our only replica and also our default replica for new tenants. Because of this failure Document Repository was not able to service requests.</p>\n\n<h3>The Root Cause</h3>\n\n<p style=\"line-height: 20.7999992370605px;\">The root cause of this accident was an outage of Monsoon. After it some VMS disks were left in read-only state.</p>\n\n<p style=\"line-height: 20.7999992370605px;\">&nbsp;</p>\n\n<pre>\n<code class=\"language-java\">Identified - We have lost connectivity to Rot DC1/BB10. Running machines are not affected,but creating new machines or modifying running vms and start/stop operation may fail. Update: some customer have been effected with read only FS. We are working on it. you will be informed individually if effected.\n\nJune 04, 03:20 UTC </code></pre>\n\n<h3>Stopped Primary Node</h3>\n\n<p style=\"line-height: 20.7999992370605px;\">The first observed symptom was that the&nbsp;<strong>mongod</strong>&nbsp;process was down on the&nbsp;<strong>mongo_docrepo_prod_rot_1/0</strong>&nbsp;machine. At the momen the Replica Set had only two nodes working (one primary, one secondary). Monit status showed \"not monitored\" for&nbsp;<strong>mongod</strong><strong>b</strong>&nbsp;job.</p>\n\n<p style=\"line-height: 20.7999992370605px;\">We performed several actions to bring it back to normal state. From MongoDB logs we knew that it's because of read-only disk where the storage folder is placed.</p>\n\n<pre>\n<code class=\"language-java\"># less /var/vcap/sys/log/monit/mongodb.err.log\n\nchown: changing ownership of '/var/vcap/store/mongodb': Read-only file system</code></pre>\n\n<p style=\"line-height: 20.7999992370605px;\">Finally we manged to fix the disk problem with manual unmount and mount of this disk.</p>\n\n<h3>First Failed Synchronization</h3>\n\n<p style=\"line-height: 20.7999992370605px;\">When the&nbsp;<strong>mongod</strong>&nbsp;was started it automatically joined the Replica Set. The synchronization between this node and the current primary was triggered. It looked like this process ended successfully, for the moment the Replica Set had 3 nodes.</p>\n\n<p style=\"line-height: 20.7999992370605px;\">Unfortunately it was only the begining of bigger problem. Soon we started to get notifications that Document Repository if returning errors. We checked the Replica Set and it was broken, it status at the moment was:</p>\n\n<table border=\"1\" cellpadding=\"1\" cellspacing=\"1\" style=\"line-height: 20.7999992370605px; width: 350px;\">\n\t<tbody>\n\t\t<tr>\n\t\t\t<td>mongo_docrepo_prod_rot_1/0</td>\n\t\t\t<td>PRIMARY</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>mongo_docrepo_prod_rot_1/1</td>\n\t\t\t<td>FATAL</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>mongo_docrepo_prod_rot_1/2</td>\n\t\t\t<td>FATAL</td>\n\t\t</tr>\n\t</tbody>\n</table>\n\n<p style=\"line-height: 20.7999992370605px;\">The problme was in huge data inconsitence between nodes. We checked the size of MongoDB storage folder on each node:</p>\n\n<table border=\"1\" cellpadding=\"1\" cellspacing=\"1\" style=\"line-height: 20.7999992370605px; width: 350px;\">\n\t<tbody>\n\t\t<tr>\n\t\t\t<td>mongo_docrepo_prod_rot_1/0</td>\n\t\t\t<td>28328084&nbsp;</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>mongo_docrepo_prod_rot_1/1</td>\n\t\t\t<td>42915956</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>mongo_docrepo_prod_rot_1/2</td>\n\t\t\t<td>43014300</td>\n\t\t</tr>\n\t</tbody>\n</table>\n\n<p style=\"line-height: 20.7999992370605px;\">&nbsp;</p>\n\n<h3>Final Recovery Procedure</h3>\n\n<p style=\"line-height: 20.7999992370605px;\">We took the following steps to recover from this situation</p>\n\n<ul style=\"line-height: 20.7999992370605px;\">\n\t<li>we stopped the current primary node to avoid data inconsistency (with new writes)</li>\n\t<li>we prune the replica to single node with the most data (mongo_docrepo_prod_rot_1/2), after that the replica was working correctly</li>\n\t<li>we stopped other nodes, cleaned up their data and restarted them</li>\n\t<li>we added them to the replica, one at the time (data was synchronized)</li>\n</ul>\n\n<p style=\"line-height: 20.7999992370605px;\">Finally we had the full replica set with all three nodes in consisten state.</p>\n\n<h3>Conclusions</h3>\n\n<ul style=\"line-height: 20.7999992370605px;\">\n\t<li>Adding a node that was down for some time because of disc problems back to replica (just starting the process) is dangerous. It might lead to data inconsistency. It's better to clean up data completely before restart.</li>\n\t<li>We need to fix our monitoring to discover problems with a mongod process or a replica set state.</li>\n\t<li>We need to have a procedure to backup data from single node. Every recovery procedure should start with backup of current data.</li>\n</ul>\n\n<h3>More detials</h3>\n\n<p style=\"line-height: 20.7999992370605px;\">If you are interested in more details of how the analysis and the recovery were done you can find them in this document:</p>\n\n<p style=\"line-height: 20.7999992370605px;\"><a href=\"https://wiki.hybris.com/pages/viewpage.action?pageId=278671998\">https://wiki.hybris.com/pages/viewpage.action?pageId=278671998</a></p>\n\n<p style=\"line-height: 20.7999992370605px;\">Best Regards,</p>\n\n<p style=\"line-height: 20.7999992370605px;\">Framefrog Team</p>\n",
      "tag" : "Post-Mortems",
      "audience" : "Visible to Internal Only"
    }
  },
  "id" : "557599139a6e313ebf0c427d"
}, {
  "sku" : "PostmortemElasticsearchnodeisdown201506081433850582764",
  "name" : "Post mortem Elasticsearch node is down [2015-06-08]",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-06-11T09:59:28.832+0000",
    "modifiedAt" : "2015-06-11T09:59:28.832+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-06-09T11:48:14.064Z",
      "author" : "lukasz.szymik@hybris.com",
      "content" : "<h1>Background</h1>\n\n<p>This is port mortem related to issue&nbsp;&nbsp;<a href=\"https://jira.hybris.com/browse/FROG-2948\"><img src=\"https://jira.hybris.com/images/icons/issuetypes/bug.png\" style=\"border-width:0px; height:16px; margin:0px 5px 0px 0px\" />FROG-2948</a>&nbsp;-&nbsp;Elastic search @ prod has only 4 nodes&nbsp;<strong>IN PROGRESS</strong></p>\n\n<p>Issue was discovered manually while checking Elastic search status because of alert related to other cluster member.</p>\n\n<p>Issue did not cause any Search service downtime (we have data being replicated to 3 nodes and only one was down) however we are still sorry that it was not discovered earlier.</p>\n\n<h1>Symptoms</h1>\n\n<p>Checking elastic search status (health) revealed that cluster has only 4 from 5 nodes.</p>\n\n<pre>\n<code class=\"language-javascript\">curl -XGET 'http://localhost:9200/_cluster/health?pretty=true'\n\n{\n\n  \"cluster_name\" : \"search-service-1\",\n\n  \"status\" : \"green\",\n\n  \"timed_out\" : false,\n\n  \"number_of_nodes\" : 4,\n\n  \"number_of_data_nodes\" : 4,\n\n  \"active_primary_shards\" : 155,\n\n  \"active_shards\" : 620,\n\n  \"relocating_shards\" : 0,\n\n  \"initializing_shards\" : 0,\n\n  \"unassigned_shards\" : 0\n\n}</code></pre>\n\n<h1>Reason</h1>\n\n<p>Bosh cloud check has shown that one of elastic search VM was down. Automatic issue resolving did not help and mounted volume was not detached properly. Unfortunately instance was down and I was not able to get ES logs from disk. Kibana for backing service did not shown any crash of node. It might be because of too long timeframe.</p>\n\n<h1>Solution</h1>\n\n<p>As the solution when commend bosh cloud check was not successful, we have manually removed volume from instance using Postgres SQL client. After that operation bosh deploy started missing instance, mount disk and cluster was back again with 5 nodes.</p>\n\n<h1>What next</h1>\n\n<p>As immediate improvement action we have created ticket for improving our ES monitoring.&nbsp;<a href=\"https://jira.hybris.com/browse/FROG-2949\"><img src=\"https://jira.hybris.com/images/icons/issuetypes/bug.png\" style=\"border-width:0px; height:16px; margin:0px 5px 0px 0px\" />FROG-2949</a>&nbsp;-&nbsp;Elasticsearch monitoring requires extension&nbsp;<strong>OPEN</strong></p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Post-Mortems"
    }
  },
  "id" : "5576d2d79c8e7695fd186788"
}, {
  "sku" : "PostmortemOutageofAPIConsoleforSearchservice1434364077091",
  "name" : "Post mortem: Outage of Search Service API Console",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-06-15T11:27:16.823+0000",
    "modifiedAt" : "2015-06-15T11:27:16.823+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-06-15T10:02:07.957Z",
      "author" : "lukasz.szymik@hybris.com",
      "content" : "<h1>Backgroud</h1>\n\n<p>This is results of investigation from last week:&nbsp;https://jira.hybris.com/browse/FROG-2959. Search Service API Console was not available on DevPortal, both environment: PROD and STAGE.</p>\n\n<h1>Symptoms</h1>\n\n<p>Issue has been discovered manually. After navigating to our API Console there was error message indicating that one of RAML files is not available: ...&nbsp;\"message\":\"cannot fetch /services/search/b1/elasticsearchSchemas.yml (Not Found)\" ...</p>\n\n<p>&nbsp;</p>\n\n<h1>Reason</h1>\n\n<p>Investigation has revealed that root cause of issue was bad character in elasticsearch.yml file. One of the description fields has illegal colon character (character in wrong place.) This caused failure in DevPortal build and API console files were not copied into final destination.</p>\n\n<p>Regression has been created by merging feature request: \"Feature/DPOR-484 complete language review of the\" without review. Feature request was created and merged by the same person during the same day.</p>\n\n<p>The file which was edited was not plain text file but YML file which must have proper formatting.</p>\n\n<p>&nbsp;</p>\n\n<h1>What next?</h1>\n\n<p>As immediately improvement actions we have taken following steps:</p>\n\n<ul>\n\t<li>We asked Wookies team if there will be possibility to improve error reporting (https://jira.hybris.com/browse/WOO-542)</li>\n\t<li>We asked Fly Speck team to not merge any feature branch without review</li>\n\t<li>We will check if there will be possiblity to limit write access to our repository so only team member might do direct writes and other persons will do pull requests which will be reviewed by us.</li>\n</ul>\n\n<p>&nbsp;</p>\n\n<p>&nbsp;</p>\n",
      "tag" : "Post-Mortems",
      "audience" : "Visible to Internal Only"
    }
  },
  "id" : "557ea8adc28eb5ba5e6d4e4d"
}, {
  "sku" : "DisasterRecoveryBackupwithBOSH1434365336327",
  "name" : "Disaster Recovery Backup with BOSH",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-06-15T12:10:20.982+0000",
    "modifiedAt" : "2015-06-15T12:10:20.982+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-06-15T10:40:41.866Z",
      "author" : "michal.zdzinski@hybris.com",
      "content" : "<p>All teams that manages their backing services have to ensure that&nbsp;no data is lost. We are using MongoDB as a primary storage. MongoDB gives us&nbsp;replication. All data lives on three independent servers and&nbsp;even when two of them are down&nbsp;we still have access to&nbsp;data.</p>\n\n<p>Unfortunately it is not enough. There are situations when volumes are corrupted or bug in the infrastructure causes that data is inconsistent.&nbsp;For such situations we need backup.</p>\n\n<p>We were looking for easy and effective solution for backup MongoDB. Recommended way for MongoDB is to use filesystem snapshots.&nbsp;We discover that such backups could be created using <a href=\"https://bosh.io/docs/snapshots.html\">BOSH snapshots</a>.</p>\n\n<p>When you configure your BOSH director it can&nbsp;take care of making such backups on demand or at regular intervals.</p>\n\n<p>Recovery from snapshot is more complicated and manual process,&nbsp;but we hope that we will not need to use it.</p>\n\n<p>The best part of this approach is that it is compatible with Monsoon and AWS,&nbsp;so we could reuse it when we will start on AWS.</p>\n\n<p>If you are interested in our findings please join us at our Sprint Review on&nbsp;Friday 19-06-2015 at 14:00.</p>\n\n<p>Regards,</p>\n\n<p>&nbsp;Team Framefrog</p>\n",
      "tag" : "News and Events",
      "audience" : "Visible to Internal Only"
    }
  },
  "id" : "557ead98c28eb5ba5e6d4e8e"
}, {
  "sku" : "ProjectMigrationtob1Actionrequiredforexistingstorefronts1434396254443",
  "name" : "Project Migration to b1: Action required for existing storefronts",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-06-15T21:23:23.576+0000",
    "modifiedAt" : "2015-06-15T21:23:23.576+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-06-15T19:22:30.004Z",
      "author" : "mike.nightingale@hybris.com",
      "content" : "<p><strong>Project Migration to b1</strong></p>\n\n<p>&nbsp;</p>\n\n<p>Good news everyone! We have officially updated the commerce applications to use the latest services!</p>\n\n<p>However, you must update your default site before you can begin to use the new version of the storefront.</p>\n\n<p>&nbsp;</p>\n\n<ul>\n\t<li>How to update your default site\n\t<ul style=\"list-style-type:circle\">\n\t\t<li>The storefront now gets its configurations from the site settings. In order to continue to use your storefront with our new version, you must setup your default site.&nbsp;</li>\n\t\t<li>Go to Commerce Settings -&gt; Site Settings and simply configure your main site</li>\n\t\t<li>Be sure to add Stripe Keys to your default site, or checkout will not work in your store.&nbsp;</li>\n\t\t<li>After you have configured your default site, be sure to configure taxes. Checkout will not work in your storefront if you have not setup taxes.</li>\n\t</ul>\n\t</li>\n</ul>\n\n<p>&nbsp;</p>\n\n<p>Please be aware that only your default site will impact the storefront! The ability to use multiple sites is coming</p>\n\n<p>&nbsp;</p>\n\n<p>Also, please be aware that search functionality has been disabled in the storefront for the time being. We hope to reintroduce this feature in the near future.</p>\n\n<p>&nbsp;</p>\n\n<p>&nbsp;</p>\n\n<p>Happy Shopping!</p>\n\n<p><strong>Project Migration to b1</strong></p>\n\n<p>&nbsp;</p>\n\n<p>Good news everyone! We have officially updated the commerce applications to use the latest services!</p>\n\n<p>However, you must update your default site before you can begin to use the new version of the storefront</p>\n\n<p>&nbsp;</p>\n\n<ul>\n\t<li>How to update your default site\n\t<ul style=\"list-style-type:circle\">\n\t\t<li>The storefront now gets its configurations from the site settings. In order to continue to use your storefront with our new version, you must setup your default site.&nbsp;</li>\n\t\t<li>Go to Commerce Settings -&gt; Site Settings and simply configure your main site</li>\n\t\t<li>Be sure to add Stripe Keys to your default site, or checkout will not work in your store.&nbsp;</li>\n\t\t<li>After you have configured your default site, be sure to configure taxes. Checkout will not work in your storefront if you have not setup taxes.</li>\n\t</ul>\n\t</li>\n</ul>\n\n<p>&nbsp;</p>\n\n<p>Please be aware that only your default site will impact the storefront! The ability to use multiple sites is coming</p>\n\n<p>&nbsp;</p>\n\n<p>Also, please be aware that search functionality has been disabled in the storefront for the time being. We hope to reintroduce this feature in the near future.</p>\n\n<p>&nbsp;</p>\n\n<p>&nbsp;</p>\n\n<p>Happy Shopping!</p>\n\n<p>&nbsp;</p>\n",
      "audience" : "Visible to All",
      "tag" : "Engineering"
    }
  },
  "id" : "557f265dc28eb5ba5e6d5185"
}, {
  "sku" : "Updatesfororderemailnotifications1434545778021",
  "name" : "Updates for order email notifications",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-06-18T08:27:06.219+0000",
    "modifiedAt" : "2015-06-18T08:27:06.219+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-06-17T12:50:28.752Z",
      "author" : "dana.roibu@hybris.com",
      "content" : "<p>If you relied on email notification for orders functionality, you should definitely read further.&nbsp;</p>\n\n<p>All your customised templates will be lost as we had to change our template owner identifier to match our service name.<br />\nWe still will automatically upload the templates, but if you made any changes to them, you will have to re-apply them.<br />\nPlease note that now you should use <em>$tools.esc.html()</em>&nbsp;function to escape values in the template (previously the service did<br />\nthat for you).</p>\n",
      "audience" : "Visible to All",
      "tag" : "Migrations"
    }
  },
  "id" : "55816e71c28eb5ba5e6d5847"
}, {
  "sku" : "DontRevealYouEmailAddressWhileBlogging1435073777016",
  "name" : "Don't Reveal You Email Address While Blogging",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-06-25T13:08:52.582+0000",
    "modifiedAt" : "2015-06-25T13:08:52.582+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-06-23T15:30:07.893Z",
      "author" : "Lukasz Gornicki",
      "content" : "<p>Hi folks,</p>\n\n<p>If you are blogging using Dev Portal Blog functionality then you need to remember one very important thing.&nbsp;When you create new post, we set your first and last name in the author filed. You provide your first and last name in Builder in your account details. If you didn't do it, our fallback mechanism sets your email address in creator field.</p>\n\n<p>We assume you would not really like to reveal your email address to external audience when blogging therefore we strongly advice you to update your details in Builder:&nbsp;<a href=\"https://builder.yaas.io/#/?selectedPath=%2FMy%20Profile%2FAccount%20Settings\">https://builder.yaas.io/#/?selectedPath=%2FMy%20Profile%2FAccount%20Settings</a></p>\n\n<p>Regards,&nbsp;</p>\n\n<p>Lukasz the Wookiee</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Engineering"
    }
  },
  "id" : "55897cf1522e1c22a57a19e9"
}, {
  "sku" : "NewWayofUIModulesAuthorizationintheBuilder1435226532581",
  "name" : "New Method of Builder Modules Authorization",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-07-01T15:33:39.559+0000",
    "modifiedAt" : "2015-07-01T15:33:39.559+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-06-25T10:01:39.331Z",
      "author" : "Patrycja Książek",
      "content" : "<p>The next Builder release introduces&nbsp;changes to Builder module authorization. The authorization request is issued from the Builder, and the redirection from the authorization service must be captured by the Builder on the client side.&nbsp;Therefore,&nbsp;every Builder&nbsp;module registered in YaaS must have a very specific Redirect URI (Builder's authorization callback) defined.&nbsp;</p>\n\n<p>If your team has already created a Builder&nbsp;module, you may need to modify its Redirect URI according to the following steps.</p>\n\n<p>1. Sign in to the Builder and go to your Team page. On the main Team page, you might see a warning about misconfiguration within the Builder module, as shown in the image below. If you see such a warning, your action&nbsp;is required so that your Builder module can be authorized and get a token to use YaaS services.</p>\n\n<p><img alt=\"First step\" src=\"https://api.yaas.io/hybris/media-repository/b1/hybris/hybris.builder/media/55912628f58e3c6d7f3183b4\" style=\"width: 800px; height: 383px;\" /></p>\n\n<p>2. Go to the&nbsp;<strong>Builder Modules</strong>&nbsp;section. The incorrect Builder modules are marked with the warning message&nbsp;<strong>Invalid Redirect URI</strong>.</p>\n\n<p><img alt=\"\" src=\"https://api.yaas.io/hybris/media-repository/b1/hybris/hybris.builder/media/559126f8702e539a84714c87\" style=\"width: 800px; height: 412px;\" /></p>\n\n<p>3. Open the&nbsp;<strong>Details</strong>&nbsp;page of the invalid Builder module,&nbsp;scroll down to the&nbsp;<strong>Client Authorization</strong>&nbsp;section, and click&nbsp;<strong>Fix it</strong>. Correct the Redirect URI as suggested by the Builder.</p>\n\n<p><img alt=\"\" src=\"https://api.yaas.io/hybris/media-repository/b1/hybris/hybris.builder/media/559276b0702e539a84714e64\" style=\"width: 800px; height: 320px;\" /></p>\n\n<p><img alt=\"\" src=\"https://api.yaas.io/hybris/media-repository/b1/hybris/hybris.builder/media/55927737702e539a84714e66\" style=\"width: 800px; height: 322px;\" /></p>\n\n<p>4. If your Builder module is included in packages subscribed to by other&nbsp;projects, your subscribers must refresh those subscriptions. Subscribers are notified, and the subscriptions are displayed to them as being outdated. Subscribers can refresh a subscription by&nbsp;clicking the&nbsp;<strong>Refresh Subscription</strong>&nbsp;button from the <strong>More</strong> menu as shown in the image below.</p>\n\n<p><img alt=\"\" src=\"https://api.yaas.io/hybris/media-repository/b1/hybris/hybris.builder/media/559128a3f58e3c6d7f3183c2\" style=\"width: 800px; height: 419px;\" /></p>\n\n<p>If you have any questions, ask the experts here&nbsp;<a href=\"https://experts.hybris.com/spaces/102/index.html\">https://experts.hybris.com/spaces/102/index.html</a>&nbsp;</p>\n",
      "audience" : "Visible to All",
      "tag" : "Migrations"
    }
  },
  "id" : "558bd1a4c0eecd787379860d"
}, {
  "sku" : "CommerceServicesDeprecationofpreb1services1435582462929",
  "name" : "Commerce Services - Deprecation of pre-b1 services",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-06-30T11:46:58.578+0000",
    "modifiedAt" : "2015-06-30T11:46:58.578+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-06-29T12:49:51.443Z",
      "author" : "Klaus Herrmann",
      "content" : "<p>Dear Customers of our Commerce Services,</p>\n\n<p>as announced in the last System Demo, all versions of commerce services prior to b1 are deprecated and are scheduled for removal on Friday, July 17.&nbsp;</p>\n\n<p>Please make sure you have migrated to versions b1 until this date; please get in touch if you have severe problems meeting this deadline. If you encounter any issued during the migration, please ask our experts on the community forum or file JIRA issues as appropriate. Please also refer to Mike's instructions on store front migrations on&nbsp;https://devportal.yaas.io/blog/post/557f265dc28eb5ba5e6d5185&nbsp;</p>\n\n<p>Happy migrating!</p>\n\n<p>Your YaaS Commerce Team</p>\n",
      "tag" : "Migrations",
      "audience" : "Visible to All"
    }
  },
  "id" : "55913ffec0eecd78737991ff"
}, {
  "sku" : "CrossOriginResourceSharingintheBuilder1435226306478",
  "name" : "Cross Origin Resource Sharing in the Builder",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-07-07T10:23:11.422+0000",
    "modifiedAt" : "2015-07-07T10:23:11.422+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-06-25T09:58:04.690Z",
      "author" : "Patrycja Książek",
      "content" : "<p>Since the latest release, Builder modules are loaded from the client&nbsp;side in the Builder. Therefore, you must allow access to the module descriptor (<strong>module.json</strong>)&nbsp;file of your Builder module from a specified origin, such as builder.yaas.io or *.yaas.io, which are configured to load Builder modules. If you do not provide valid CORS headers in the web server, your Builder module will not be loaded.</p>\n\n<p><strong style=\"line-height: 23.1111106872559px;\">This will be required starting on July 15th.</strong><span style=\"line-height: 23.1111106872559px;\">&nbsp;Until then, there is a fallback in place that makes your module work without valid CORS configuration.</span></p>\n\n<p>If you use the Cloud Foundry staticfile-buildpack, implement the following configuration:</p>\n\n<blockquote>\n<p><tt>worker_processes 1;<br />\ndaemon off;</tt></p>\n\n<p><tt>error_log &lt;%= ENV[\"APP_ROOT\"] %&gt;/nginx/logs/error.log;<br />\nevents { worker_connections 1024; }</tt></p>\n\n<p><tt>http {<br />\n&nbsp; log_format cloudfoundry '$http_x_forwarded_for - $http_referer - [$time_local] \"$request\" $status $body_bytes_sent';<br />\n&nbsp; access_log &lt;%= ENV[\"APP_ROOT\"] %&gt;/nginx/logs/access.log cloudfoundry;<br />\n&nbsp; default_type application/octet-stream;<br />\n&nbsp; include mime.types;<br />\n&nbsp; sendfile on;<br />\n&nbsp; gzip on;<br />\n&nbsp; tcp_nopush on;<br />\n&nbsp; keepalive_timeout 30;<br />\n&nbsp; port_in_redirect off; # Ensure that redirects don't include the internal container PORT - &lt;%= ENV[\"PORT\"] %&gt;<br />\n&nbsp; server_tokens off;</tt></p>\n\n<p><tt>&nbsp; server {<br />\n&nbsp; &nbsp; listen &lt;%= ENV[\"PORT\"] %&gt;;<br />\n&nbsp; &nbsp; server_name localhost;</tt></p>\n\n<p><tt>&nbsp; &nbsp; location / {<br />\n&nbsp; &nbsp; &nbsp; root &lt;%= ENV[\"APP_ROOT\"] %&gt;/public;<br />\n&nbsp; &nbsp; &nbsp; index index.html index.htm Default.htm;<br />\n&nbsp; &nbsp; &nbsp; &lt;% if File.exists?(File.join(ENV[\"APP_ROOT\"], \"nginx/conf/.enable_directory_index\")) %&gt;<br />\n&nbsp; &nbsp; &nbsp; autoindex on;<br />\n&nbsp; &nbsp; &nbsp; &lt;% end %&gt;<br />\n&nbsp; &nbsp; &nbsp; &lt;% if File.exists?(auth_file = File.join(ENV[\"APP_ROOT\"], \"nginx/conf/.htpasswd\")) %&gt;<br />\n&nbsp; &nbsp; &nbsp; auth_basic \"Restricted\"; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;#For Basic Auth<br />\n&nbsp; &nbsp; &nbsp; auth_basic_user_file &lt;%= auth_file %&gt;; &nbsp;#For Basic Auth<br />\n&nbsp; &nbsp; &nbsp; &lt;% end %&gt;<br />\n&nbsp; &nbsp; &nbsp; &lt;% if ENV[\"FORCE_HTTPS\"] %&gt;<br />\n&nbsp; &nbsp; &nbsp; if ($http_x_forwarded_proto = http) {<br />\n&nbsp; &nbsp; &nbsp; &nbsp; return 301 https://$host$request_uri;<br />\n&nbsp; &nbsp; &nbsp; }<br />\n&nbsp; &nbsp; &nbsp; &lt;% end %&gt;<br />\n&nbsp; &nbsp; &nbsp;&nbsp;<br />\n&nbsp; &nbsp; &nbsp; if ($request_method = 'OPTIONS') {<br />\n&nbsp; &nbsp; &nbsp; &nbsp; add_header 'Access-Control-Allow-Origin' '*';<br />\n&nbsp; &nbsp; &nbsp; &nbsp; add_header 'Access-Control-Allow-Credentials' 'true';<br />\n&nbsp; &nbsp; &nbsp; &nbsp; add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';<br />\n&nbsp; &nbsp; &nbsp; &nbsp; add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';<br />\n&nbsp; &nbsp; &nbsp; &nbsp; add_header 'Access-Control-Max-Age' 1728000;<br />\n&nbsp; &nbsp; &nbsp; &nbsp; add_header 'Content-Type' 'text/plain charset=UTF-8';<br />\n&nbsp; &nbsp; &nbsp; &nbsp; add_header 'Content-Length' 0;<br />\n&nbsp; &nbsp; &nbsp; &nbsp; return 204;<br />\n&nbsp; &nbsp; &nbsp; }<br />\n&nbsp; &nbsp; &nbsp; if ($request_method = 'GET') {<br />\n&nbsp; &nbsp; &nbsp; &nbsp; add_header 'Access-Control-Allow-Origin' '*';<br />\n&nbsp; &nbsp; &nbsp; &nbsp; add_header 'Access-Control-Allow-Credentials' 'true';<br />\n&nbsp; &nbsp; &nbsp; &nbsp; add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';<br />\n&nbsp; &nbsp; &nbsp; &nbsp; add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';<br />\n&nbsp; &nbsp; &nbsp; }<br />\n&nbsp; &nbsp; &nbsp; if ($request_method = 'POST') {<br />\n&nbsp; &nbsp; &nbsp; &nbsp; add_header 'Access-Control-Allow-Origin' '*';<br />\n&nbsp; &nbsp; &nbsp; &nbsp; add_header 'Access-Control-Allow-Credentials' 'true';<br />\n&nbsp; &nbsp; &nbsp; &nbsp; add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';<br />\n&nbsp; &nbsp; &nbsp; &nbsp; add_header 'Access-Control-Allow-Headers' 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';<br />\n&nbsp; &nbsp; &nbsp; }<br />\n&nbsp; &nbsp; }<br />\n&nbsp; }<br />\n}</tt></p>\n</blockquote>\n\n<p>&nbsp;</p>\n\n<p>Add the code snippet above to the&nbsp;<strong>nginx.conf</strong> file in the root folder of your Builder module. It is automatically detected and used by the buildpack. You can modify&nbsp;the configuration according to your&nbsp;needs. This default configuration enables access from all instances of the specified origin to any resource of your Builder module using GET or POST requests on the client side.</p>\n",
      "audience" : "Visible to All",
      "tag" : "Migrations"
    }
  },
  "id" : "558bd0c258cec7eb95366a55"
}, {
  "sku" : "DeprecationofSearchServicev01435748327627",
  "name" : "Deprecation of Search Service v0",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-07-01T10:59:12.075+0000",
    "modifiedAt" : "2015-07-01T10:59:12.075+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-07-01T10:56:14.591Z",
      "author" : "lukasz.szymik@hybris.com",
      "content" : "<h1>Search service v0 goes away</h1>\n\n<p>The brand new version of search service will be released soon. New version is backed by new cluster of Elasticsearch.&nbsp;Together with introduction of new version we will deprecate the old one.&nbsp;</p>\n\n<p>The old version v0 will be removed in 2 weeks. You could use these timeframe for migrate to new version. Please note that there will be no migration of data between versions.</p>\n\n<p>&nbsp;</p>\n\n<p>Cheers</p>\n\n<p>Framefrog Team.</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Engineering"
    }
  },
  "id" : "5593c7e7ce8e889467b65435"
}, {
  "sku" : "MemoryleakinHystrixlibrary1435923336027",
  "name" : "Memory leak in Hystrix library",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-07-03T11:37:27.478+0000",
    "modifiedAt" : "2015-07-03T11:37:27.478+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-07-03T11:32:28.011Z",
      "author" : "lukasz.szymik@hybris.com",
      "content" : "<h1>Hystrix library has memory leak in version 1.4.9</h1>\n\n<p>Framefrog team recently fighted with memory leak in our services. We discovered that Document Repository has been crashing with out of the memory.</p>\n\n<p>After 2 days of investigation we found that issue was cause by memory leak in hystrix library.</p>\n\n<p>&nbsp;</p>\n\n<h1>Solution</h1>\n\n<p>We updated hystrix library to newest version: 1.4.12&nbsp;</p>\n\n<p>According to hystrix change log the issue was fixed in version 1.4.10. For more details please refer to:&nbsp;https://github.com/Netflix/Hystrix/blob/master/CHANGELOG.md</p>\n\n<p>&nbsp;</p>\n\n<p>&nbsp;</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Engineering"
    }
  },
  "id" : "559673887eae8ee2dbc8d937"
}, {
  "sku" : "CrowdIssuesarenotOnlyCausedbyitsUnavailability1436534138245",
  "name" : "Crowd Issues are not Only Caused by its Unavailability",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-07-10T13:29:04.309+0000",
    "modifiedAt" : "2015-07-10T13:29:04.309+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-07-10T12:48:22.050Z",
      "author" : "Lukasz Gornicki",
      "content" : "<p>Hi,</p>\n\n<p>Recently we had few issues with availability of our Web sites (Dev Portal, YaaS Market and YaaS Home). They were running fine but you couldn't access them. These issues were connected to unavailability of&nbsp;the Crowd server (main authorization service for all hybris enterprise applications like hybris Wiki or hybris Experts). &nbsp;</p>\n\n<p><strong>Such an issue is easy to identify</strong>:&nbsp;Dev Portal is down on all environments? then log out from hybris Wiki and you won't be able to log in again - Crowd&nbsp;server unavailable.</p>\n\n<p><strong>Solution</strong>: Contact IT, but they probably know already and work on the solution.</p>\n\n<p>&nbsp;</p>\n\n<p>Today we had quite different issue, connected to Crowd but not really caused by it but by Monsoon. Why?</p>\n\n<p>To enable Crowd in your application, you need to register it in Crowd and provide its public IP. Simple as that. Problem is that for YaaS on Monsoon we don't know when the IP is going to change. Old IP was&nbsp;155.56.37.8 and today it changed to&nbsp;155.56.37.10.&nbsp;</p>\n\n<p><strong>Such an issue is easy to identify</strong>:&nbsp;Dev Portal is down on all environments? then log out from hybris Wiki and if you are able to log in back again - YaaS public IP changed.</p>\n\n<p><strong>Solution</strong>: Contact IT, they have no idea about the issue. They will be able to confirm it only by looking on their logs and confirming that they are bouncing back all the requests from us.&nbsp;</p>\n\n<p>&nbsp;</p>\n\n<p>Above is important for teams usign Crowd in their applications. Luckly you need to remember about it only till open beta when we get rid of Crowd (except of Dev Portal Internal).</p>\n\n<p>&nbsp;</p>\n\n<p>Cheers,</p>\n\n<p>Lukasz the Wookiee</p>\n\n<p>&nbsp;</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Post-Mortems"
    }
  },
  "id" : "559fc57a192ef4d9968a196e"
}, {
  "sku" : "Toolforexportandimportservicedefinitions1436966230144",
  "name" : "Tool for export and import service definitions",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-07-15T13:24:22.908+0000",
    "modifiedAt" : "2015-07-15T13:24:22.908+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-07-15T13:08:37.526Z",
      "author" : "Piotr Bochynski",
      "content" : "<p>If you have many services with complex authorization rules and&nbsp;many scopes you probably want to avoid manual editing them in Builder. To simplify this task you can use new tool that is able to export service definitions into json and import them later (even for&nbsp;another environment or team). Tool uses account API and require the same credentials as Builder application.</p>\n\n<p>See more:&nbsp;<a href=\"https://github.wdf.sap.corp/toad/yaas-tools\">https://github.wdf.sap.corp/toad/yaas-tools</a></p>\n\n<blockquote>\n<p>Note: You need node.js installed on your computer&nbsp;to run the tool.</p>\n</blockquote>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Engineering"
    }
  },
  "id" : "55a65d56e10e1b156b88370c"
}, {
  "sku" : "YourActionRequiredEnableCORSForYourBuilderModule1437028176690",
  "name" : "Your Action Required! -  Enable CORS For Your Builder Module",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-07-16T08:17:16.649+0000",
    "modifiedAt" : "2015-07-16T08:17:16.649+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-07-16T05:58:12.411Z",
      "author" : "Krzysztof Kwiatosz",
      "content" : "<p>Due to upcomming switch-off of the Builder's server components, we would like to remind&nbsp;you again about the neccessary adjustments for your Builder modules.&nbsp;</p>\n\n<p><strong>Your module will be reacheable from the Builder only if you enable Cross-Origin Resource Sharing (CORS)!</strong></p>\n\n<p>We have announced that already&nbsp;in one of our recent blogposts, where we have also described how to enable CORS for Builder modules hosted via&nbsp;staticfile-buildpack:</p>\n\n<p><a href=\"https://devportal.yaas.io/blog/post/558bd0c258cec7eb95366a55\">https://devportal.yaas.io/blog/post/558bd0c258cec7eb95366a55</a></p>\n\n<p>We will switch server components off&nbsp;in the sprint starting next week. That means, we will switch it off&nbsp;from July 20th on at any time without further notice.</p>\n\n<p>Regards,</p>\n\n<p>The Builder Team</p>\n",
      "audience" : "Visible to All",
      "tag" : "Migrations"
    }
  },
  "id" : "55a74f507ecef0f015cbe38b"
}, {
  "sku" : "DedicatedBuilderModuleforEmailTemplates1437575104757",
  "name" : "Dedicated Builder Module for Email Templates",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-07-23T09:28:18.547+0000",
    "modifiedAt" : "2015-07-23T09:28:18.547+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-07-22T14:18:14.347Z",
      "author" : "Krzysztof Kwiatosz",
      "content" : "<p>Email service has now a dedicated Builder module for&nbsp;managing email templates that clients may use on behalf of your tenant.</p>\n\n<p>This module is no longer built-in the Builder client. It is an external Builder module that is a part of the&nbsp;<strong>Core Services</strong> package and will be visible only if you subscribe to the package.</p>\n\n<p>If you are already a subscriber of the&nbsp;<strong>Core Services </strong>package, you need to refresh the subscription. Once you do that, the module will appear in the navigation next to other subscribed Builder modules.</p>\n",
      "audience" : "Visible to All",
      "tag" : "Migrations"
    }
  },
  "id" : "55afa7c0ee6ec7c1367fea05"
}, {
  "sku" : "CoreServicesDeprecationofpreb1services1437753085195",
  "name" : "Core Services - Deprecation of pre-b1 services",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-07-24T15:52:44.977+0000",
    "modifiedAt" : "2015-07-24T15:52:44.977+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-07-24T15:45:36.964Z",
      "author" : "Andrea Stubbe",
      "content" : "<p>Dear Customers of our Core Services,</p>\n\n<p>as announced previously in this Blog, all Core services prior to the b-versions have been&nbsp;scheduled for removal on Friday, July 17. And today, one week later, we really did it!</p>\n\n<p>If something in your services or applications breaks, this might be the reason for it.&nbsp;Make sure to check this, before you dig deeper.&nbsp;Ask the experts, if you have any trouble migrating to the current versions - we're happy to help you.</p>\n\n<p>Enjoy the new and better versions,</p>\n\n<p>Andrea and the Core teams</p>\n\n<p>&nbsp;</p>\n",
      "tag" : "Migrations",
      "audience" : "Visible to All"
    }
  },
  "id" : "55b25efded8ecc20601317bc"
}, {
  "sku" : "WhatisrequiredtomoveYaaStoAmazon1438004412654",
  "name" : "What is required to move YaaS to Amazon",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-07-27T13:53:12.907+0000",
    "modifiedAt" : "2015-07-27T13:53:12.907+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-07-27T13:38:55.675Z",
      "author" : "michael.stephan@sap.com",
      "content" : "<p><strong>Accounts</strong></p>\n\n<p>In order to restore the full functionality of your YaaS services/ applications on the new Amazon based environment you will need various accounts:</p>\n\n<p><em>Amazon account:</em></p>\n\n<p>The Amazon account you will only need if your team operates its own backing services (e.g. a special database like Cassandra, ...). The detailed procedure for requesting an account can be found at https://jam4.sapjam.com/wiki/show/96Z1Q32arOgPFb3Fddwg3Q. The request procedure can be summarized as follows:</p>\n\n<ul>\n\t<li>open an IT direct ticket categorized as SRIS_APPL_CLOUD_AMAZON</li>\n\t<li>complete the questionnaire contained in the detailed procedure and attach to the IT direct ticket</li>\n\t<li>submit</li>\n</ul>\n\n<p>After 1-3 days the contacts mentioned in the questionnaire will receive notification mails. This means your accounts are ready to be used. Please be reminded once more that you may only need an Amazon account if you run backing services like native databases, messagging middleware, etc. The account sourcing process for hybris/ YaaS teams is executed by team Idefix, all other SAP teams need to follow the process as described above.&nbsp;</p>\n\n<p><em>Cloud Foundry (CF) account:</em></p>\n\n<p>As a CEC SAP or YaaS team you are allowed to host your applications in the YaaS Cloud Foundry instances. For this purpose your team requires certain Cloud Foundry credentials. For requesting the credentials please use the request form at https://wiki.hybris.com/display/ytech/Cloud+Foundry+Request+Form. In addition please indicate whether your team needs to host applications directly via yaas.io. Examples are: COIN, market, raml patterns, etc. Teams only providing services do not need to host them directly on yaas.io. The proxy takes care that the service endpoints are reachable via api.yaas.io anyway.&nbsp;</p>\n\n<p><em>YaaS account:</em><br />\nOnce the core YaaS stack is fully functional on the new Amazon environment please re-create your YaaS accounts. For this purpose please visit the site https://market.yaas.io/#/register/. We will inform you once this step can be successfully accomplished.</p>\n\n<p><br />\n<strong>Backing services/ services/ applications setup</strong></p>\n\n<p>If your team needs to setup backing services in its own Amazon account please get in touch with team-idefix@sap.com (use the subject line \"amazon account setup\") and arrange a meeting. Be aware of the fact that currently they are very busy with setting up the new YaaS on Amazon, therefore the meeting with you may not take place instantly. Still it is very important to communicate, as certain information needs to be aligned to smoothen upstream processes. One example is the Classless Inter-Domain Routing (CIDR) blocks (e.g. 10.0.0.0/16) you are using in your VPCs. In case you chose the same CIDR block ranges as used in existing YaaS accounts your VPC would need to be recreated, as CIDRs ranges must not overlap.&nbsp;</p>\n\n<p>Once you have set up your Amazon accounts you can continue with installing your Cloud Foundry applications. This should be a very straightforward task. All it requires is to</p>\n\n<ul>\n\t<li>push your application to a different Cloud Foundry endpoint (once the new endpoints are available their urls will be announced in a dedicated blog post)</li>\n\t<li>with your new Cloud Foundry credentials.</li>\n</ul>\n\n<p>In addition your application configuration may also be updated (e.g. change of url, etc.) but this depends on your actual implementation.</p>\n\n<p>If you installed your backing services in your own Amazon account your Cloud Foundry applications are still not able to communicate with them. In order to enable the communication please contact team-idefix@sap.com (use the subject line \"VPC peering request\"). They will establish a VPC peering connection (http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/vpc-peering.html) together with you.&nbsp;</p>\n\n<p>&nbsp;</p>\n\n<p><strong>Operations tools</strong></p>\n\n<p style=\"line-height: 20.7999992370605px;\">This week we are looking forward to make the performance test CI and a new uptime instance avaialble in the new Amazon environment. We will let you know via blog post and the hip chat channel once it can be used. Once available your team may migrate any performance tests. This includes following activities:</p>\n\n<ul>\n\t<li style=\"line-height: 20.7999992370605px;\">Migration of checks to the stash repository</li>\n\t<li style=\"line-height: 20.7999992370605px;\">Migration of the performance CI jobs to thew new jenkins&nbsp;</li>\n</ul>\n\n<p style=\"line-height: 20.7999992370605px;\">Uptime checks we are migrating for you. The detailed process reads as follows:</p>\n\n<ol>\n\t<li>We will provide an additional external uptime system</li>\n\t<li>The new uptime will be a clone of the known external uptime (uptime-ext.cf.hybris.com). It contains the same data only statuspage.io and victorops plugins are disabled</li>\n\t<li>The links of all checks will be changed from yaas.io to yaas.ninja by us</li>\n\t<li>Teams update the credentials used for their checks once their new services are deployed</li>\n\t<li>After switch over we will change back all urls from yaas.ninja to yaas.io</li>\n</ol>\n\n<p><br />\n<strong>Miscellaneous</strong></p>\n\n<ul>\n\t<li>In order to optimize the service configuration process across multiple environments one of our teams implemented a support tool that makes your life easier. Find further information about the tool at https://devportal.yaas.io/internal/blog/post/55a65d56e10e1b156b88370c.</li>\n</ul>\n\n<p>&nbsp;</p>\n\n<p>For any further questions please contact us directly.</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Migrations"
    }
  },
  "id" : "55b634bc3aaeb1d2240fb3d1"
}, {
  "sku" : "Trustisgoodbutcontrolisbetter1438012347610",
  "name" : "Trust is good but control is better!",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-07-27T16:04:54.260+0000",
    "modifiedAt" : "2015-07-27T16:04:54.260+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-07-27T15:47:06.513Z",
      "author" : "Andreas Hauke",
      "content" : "<p>To ensure that only services we know and trust can call our services directly, we have to enable authentication between the entity thats's calling, and the service which is called.&nbsp;</p>\n\n<p>There are several ways to implement authentication between two servers or restrict access to them. The Toads already implemented Basic Authentication for authentication between&nbsp;the API-Proxy and&nbsp;service.</p>\n\n<p>So we decided in the first step to do following and this means implementation steps for&nbsp;each team publishing services with YaaS:</p>\n\n<p>- Only accept calls coming to your service with Basic Authentication</p>\n\n<p>--&gt; Authorization Header with Basic and Base64 encoded username/password combination</p>\n\n<p>e.g. Basic {someToken}</p>\n\n<p>{someToken} --&gt; base64(username+':'+password)</p>\n\n<p>To limit your implementation efforts and keep things simple, in the first phase, we will use a shared password for all hybris teams. But in the end we will have to ensure that every service has is own credentials or is only called over the&nbsp;API-proxy (also using Basic Authentication).</p>\n\n<p>All teams in CEC have to ensure in Builder to set up their Basic Authentication and have their services enabled to accept only calls from authenticated API-Proxy or their services with&nbsp;Basic Authentication credentials. Also ensure that if you interact with some YaaS Core or Commerce&nbsp;services that you have to call it via API-Proxy.</p>\n\n<p>If there are any questions let me know. And&nbsp;yes,&nbsp;we know there a several other ways to ensure authentication or do restrictions, like certificates or using network restrictions. But for&nbsp;now we decided to have Basic Authentication in place.&nbsp;</p>\n\n<p>Please ask the hybris experts (<a href=\"https://experts.hybris.com/spaces/102/index.html\">https://experts.hybris.com/spaces/102/index.html</a>), if you have any questions!</p>\n\n<p>Andreas H.</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Engineering"
    }
  },
  "id" : "55b653bbcb6e87045c699a88"
}, {
  "sku" : "CloudFoundryisavailableonProduction1438067939004",
  "name" : "Cloud Foundry is available on Production",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-07-28T07:31:23.510+0000",
    "modifiedAt" : "2015-07-28T07:31:23.510+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-07-28T07:14:59.455Z",
      "author" : "michael.stephan@sap.com",
      "content" : "<p>Dear all!</p>\n\n<p>Thanks to team Idefix the production&nbsp;Cloud&nbsp;Foundry installation is available on our new Amazon environment. Last night you should have received the required&nbsp;credentials.</p>\n\n<p>&nbsp;</p>\n\n<p><strong>API endpoint:</strong></p>\n\n<p>cf api&nbsp;<a href=\"https://api.us-east.prod.cf.yaas.ninja/\">https://api.us-east.prod.cf.yaas.ninja</a>&nbsp;--skip-ssl-validation</p>\n\n<p><strong>Domain for (web-)apps:&nbsp;</strong></p>\n\n<p>*.yaas.ninja</p>\n\n<p><strong>Internal service domains:</strong></p>\n\n<p>* .internal.us-east.yaas.ninja</p>\n\n<p>&nbsp;</p>\n\n<p>So far the API endpoint is unprotected and uses an invalid certificate. For that reason use the&nbsp;--skip-ssl-validation flag when accessing the API. In addition we are still missing some subdomains, e.g. *.modules.yaas.io, etc.</p>\n\n<p>Please proceed with setting up your services on the new environment. Even when you have installed your services we don't expect those to work properly at this point in time. Most probably dependent services are still missing, etc.</p>\n\n<p>Still, please proceed with the deployment as it shows you if your deployment processes are working so those will not cause delays in the future.&nbsp;</p>\n\n<p>If you have further questions please approach us team Idefix or me.</p>\n\n<p>&nbsp;</p>\n\n<p>Cheers,</p>\n\n<p>Michael</p>\n\n<p>&nbsp;</p>\n\n<p>&nbsp;</p>\n",
      "tag" : "Migrations",
      "audience" : "Visible to Internal Only"
    }
  },
  "id" : "55b72ce3cb6e87045c699ced"
}, {
  "sku" : "BasicAuthenticationforEmailandConfigurationService1438270487418",
  "name" : "Basic Authentication for Email and Configuration Service",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-07-30T15:45:31.298+0000",
    "modifiedAt" : "2015-07-30T15:45:31.298+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-07-30T14:43:02.718Z",
      "author" : "Michael Riedel",
      "content" : "<p>We, team Bananas, are planing to enforce <a href=\"http://tools.ietf.org/html/rfc2617\">HTTP Basic Authentication</a> for our services (Email and Configuration) very soon, see timeline below. If you are already calling these services through the YaaS API Proxy (api.yaas.io, api.stage.yaas.io) this change will not affect you, and you can skip the rest of this post.</p>\n\n<p>Calling our services directly (*.prod.cf.hybris.com, *.stage.cf.hybris.com) will not work any more. You'll have to mitigate using either of the following approaches:</p>\n\n<ul>\n\t<li>Adjust your service/application to call the services via the YaaS API Proxy, after obtaining a suitable OAuth2 access token.</li>\n\t<li>Get in touch with team Bananas and notify us that you want to access our services directly. We can then setup HTTP Basic Authentication credentials for you to access our services directly. (For starters, we can also use credentials shared by all YaaS core teams, as <a href=\"/internal/blog/post/55b653bbcb6e87045c699a88\">suggested by Andreas Hauke</a>. However, we'll only do that for our services, if there is actual demand.)<br />\n\tThen adjust your own service/application to send these HTTP Basic Authentication credentials along with every request to our services. You'll also have to use SSL for your requests.</li>\n</ul>\n\n<h3>Timeline</h3>\n\n<p>The following timeline is planed for enforcing HTTP Basic Authentication for our services:</p>\n\n<table>\n\t<tbody>\n\t\t<tr>\n\t\t\t<td>Thu, Jul 30, 2015</td>\n\t\t\t<td>Configuration b1 (internally v5) on stage</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>Email b1 (internally v4) on stage</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>Mon, Aug 3, 2015</td>\n\t\t\t<td>Configuration b1 (internally v5) on prod</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>&nbsp;</td>\n\t\t\t<td>Email b1 (internally v4) on prod</td>\n\t\t</tr>\n\t</tbody>\n</table>\n\n<h3>Effects on AWS Migration</h3>\n\n<p>Like everyone else in YaaS, team Bananas is working on migrating our services to AWS. Please be aware that on AWS we'll enforce HTTP Basic Authentication from the very beginning!</p>\n\n<p>On a side-note: older versions of our services (that is Configuration v4, Email v3) will not be available on AWS.</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Migrations"
    }
  },
  "id" : "55ba44171d6e91f4e3f2ebff"
}, {
  "sku" : "MovingtoAWSChangeofplan1438596722706",
  "name" : "Moving to AWS - Change of plan",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-08-04T08:10:00.302+0000",
    "modifiedAt" : "2015-08-04T08:10:00.302+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-08-03T10:10:52.446Z",
      "author" : "michael.stephan@sap.com",
      "content" : "<p>Dear all!</p>\n\n<p>there were slight changes in the \"Moving to AWS\" plan and therefor the expectations towards the teams changed. Team Toad could already set up the account service b1 in AWS production. The service is the same as the v2 version we know from Monsoon, it only has a new name. As agreed with team Toad they will also create new b1 proxies on stage and production Monsoon. All the environments shall be aligned (the status is tracked at https://jira.hybris.com/browse/TOAD-1945).</p>\n\n<p>Next to the account service also the builder was set up and can already be used. This means that the fundamental YaaS functionality is available and that all teams can start deploying and test their production applications.</p>\n\n<p>Required actions:</p>\n\n<ul>\n\t<li>deploy all your teams' services and align with teams who run services you are dependant on (3-4. August)</li>\n\t<li>register all your team's services in the builder, aka. create the service proxies (3-4. August)</li>\n\t<li>perform smoke&nbsp;tests. The goal is to verify that all components can communicate properly among each other. In addition the basic functionality shall be verified. A full blown functional test&nbsp;is not required&nbsp;(until 6. August)</li>\n</ul>\n\n<p>Once your service becomes available and once it was functional tested please change its status on the overview page (https://wiki.hybris.com/pages/viewpage.action?pageId=283056713, set the tested flag to \"yes\"). Also please don't forget about the YAWS JIRA tickets.</p>\n\n<p><br />\nPlease try hard to finish the testing activities until 6. August. We know that this is challenging but still can be achieved. After the 6. of August once all teams reported that they could perform their tests, the teams Framefrog and Toad will wipe out the account/ service/ team/ ... data from the AWS production environment. After doing so they re-create the new structure following the new organization rules (for further details please read https://wiki.hybris.com/display/ytech/2015/07/31/Next+Steps%3A+Account+Service+and+API+Proxy+on+AWS). Their script only creates organizations, teams, users and package skeletons. Once the new structure is available all POs will be invited who then invite their team members.</p>\n\n<p>Team Toad will not migrate your service definitions nor builder modules . In order to avoid setting up the service definitions manually again please use the script provided by them (https://devportal.yaas.io/internal/blog/post/55a65d56e10e1b156b88370c). You could use the tool already now for migrating the service definition from Monsoon to AWS. Builder modules need to be re-registerd manually.</p>\n\n<p>If there are any further questions please approach us.</p>\n\n<p>Cheers,<br />\nMichael</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Migrations"
    }
  },
  "id" : "55bf3e4fcb6e87045c69b51b"
}, {
  "sku" : "ToadsonAWS1438600289687",
  "name" : "Toads on AWS!",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-08-03T11:14:38.436+0000",
    "modifiedAt" : "2015-08-03T11:14:38.436+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-08-03T10:49:20.104Z",
      "author" : "piotr.mscichowski@hybris.com",
      "content" : "<p>Hello YaaS colleagues !</p>\n\n<p>We are happy to announce that last Friday we (Team TOAD) deployed proxy and account-service on prod environment on AWS.<br />\nAddresses of our services are:</p>\n\n<p>Proxy url : <a href=\"https://api.yaas.ninja\">https://api.yaas.ninja</a><br />\nAccount service via proxy : <a href=\"https://api.yaas.ninja/hybris/account/b1\">https://api.yaas.ninja/hybris/account/b1</a><br />\nOuath2 url : <a href=\"https://api.yaas.ninja/hybris/oauth2/b1\">https://api.yaas.ninja/hybris/oauth2/b1</a></p>\n\n<p>Please note that account service version for AWS is <strong>b1</strong> and it is the same as <strong>v2</strong> on monsoon.<br />\nWe will support <strong>v2 </strong>version of account and ouath2&nbsp; on monsoon <strong>till 24.08.2015</strong>.</p>\n\n<p>Today version <strong>b1</strong> on monsoon will be created.</p>\n\n<p>Currently, we are working on maintaining account and proxy - fixing bugs discovered during the migration.<br />\nIf you find any problems, please contact us via hipchat, email (team-toad@sap.com) or create a jira ticket.</p>\n\n<p>Best regards,<br />\nTeam Toad</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Migrations"
    }
  },
  "id" : "55bf4c3ea96eb999f878f4fd"
}, {
  "sku" : "DevPortalonAWS1438602903225",
  "name" : "Dev Portal on AWS! [internal]",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-08-03T14:33:57.627+0000",
    "modifiedAt" : "2015-08-03T14:33:57.627+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-08-03T11:44:40.259Z",
      "author" : "lukasz.przezorski@sap.com",
      "content" : "<p>Hello&nbsp;<span style=\"line-height: 20.7999992370605px;\">YaaS!</span></p>\n\n<p>Team Wookiee succesfully migrated Dev Portal and Feed Service to AWS. You can reach Dev Portal here:&nbsp;<a href=\"http://devportal.yaas.ninja\">http://devportal.yaas.ninja</a></p>\n\n<p>Credentials to the Dev Portal:</p>\n\n<ul>\n\t<li>login:&nbsp;<strong>devportal</strong></li>\n\t<li>password: <strong>w00kies!</strong></li>\n</ul>\n\n<p>Credentails to the internal part of the&nbsp;Dev Portal:</p>\n\n<ul>\n\t<li>login: <strong>internal</strong></li>\n\t<li>password:&nbsp;<strong>tuma8ephE*</strong></li>\n</ul>\n\n<p><strong>​</strong></p>\n\n<p>That is all, folks.&nbsp;May the Force be with you!</p>\n\n<p><br />\nCheers!</p>\n\n<h3 style=\"color:#aaa;font-style:italic;\"><br />\nThe Wookiees</h3>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Migrations"
    }
  },
  "id" : "55bf56731d6e91f4e3f2f8b0"
}, {
  "sku" : "Externaluptimemoved1438667269319",
  "name" : "External uptime moved",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-08-10T07:54:19.243+0000",
    "modifiedAt" : "2015-08-10T07:54:19.243+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-08-04T05:44:08.348Z",
      "author" : "michael.stephan@sap.com",
      "content" : "<p>Dear alll!</p>\n\n<p>yesterday the disks of the external uptime corrupted and therefore the machines needed to be re-surrected. The good news is that no data was lost still its external dns changed. By now the external uptime is only reachable under its new dns name.&nbsp;https://uptime-ext.cf.hybris.com/ does not work at this point in time.</p>\n\n<ul>\n\t<li>url: https://<span class=\"s1\">52.18.240.157</span></li>\n</ul>\n\n<p>The username and password are still the same.</p>\n\n<ul>\n\t<li>username: monitor</li>\n\t<li>password:&nbsp;tuoqhujokspp</li>\n</ul>\n\n<p>&nbsp;</p>\n\n<p>Together with team Tollans we&nbsp;already set up a dedicated uptime for new yaas.ninja but further information about this topic will be published in a dedicated blog post.</p>\n\n<p>&nbsp;</p>\n\n<p>Cheers,</p>\n\n<p>Michael&nbsp;&nbsp;</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Migrations"
    }
  },
  "id" : "55c05205a96eb999f878f760"
}, {
  "sku" : "UptimeforAWSavailable1438759794772",
  "name" : "Uptime for AWS available",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-08-06T14:02:38.840+0000",
    "modifiedAt" : "2015-08-06T14:02:38.840+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-08-05T07:28:33.758Z",
      "author" : "michael.stephan@sap.com",
      "content" : "<p>Dear all!</p>\n\n<p>thanks to team Tollans uptime is now also available for the new AWS YaaS. As already announced we moved all your checks and changed all the check target urls. Simply speaking, we replaced all urls with yaas.io with yaas.ninja. As expected all checks turned red.</p>\n\n<p>As a next step we would need the teams, once their services are running under the ninja domain to adapt the their credentials. Once done for each service we expect that the checks turn green again. <em><strong>Please don't start working on this task prior being asked to do so as this may result in double efforts on your side!</strong></em> You are all aware of the fact that this and early next week we do a basic setup of the AWS environment but still will wipe it again. After the wipe services need to be redeployed and therefor the credentials change again. Only then the checks should be adapted.&nbsp;</p>\n\n<p>Initially we disabled any hipchat, victorops, statuspage notifications from the new uptime system.</p>\n\n<p>At the moment yaas.ninja becomes yaas.io we will adapt the check urls. In addition we will re-activate all the notification channels and disable the old uptime installation.</p>\n\n<p><br />\nNew uptime (checks services deployed to yaas.ninja domain)</p>\n\n<ul>\n\t<li>url: https://uptime.yaas.io</li>\n\t<li>username: monitor&nbsp;</li>\n\t<li>password: tuoqhujokspp</li>\n</ul>\n\n<p>Old uptime</p>\n\n<ul>\n\t<li>url: https://52.18.240.157</li>\n\t<li>username: monitor&nbsp;</li>\n\t<li>password: tuoqhujokspp</li>\n</ul>\n\n<p>We will add the nice DNS names once we have those available.</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Migrations"
    }
  },
  "id" : "55c1bb72cb6e87045c69bbf3"
}, {
  "sku" : "BOSHreleasechangedfromlogstashshipperboshreleasetonxlogboshrelease1438852741232",
  "name" : "BOSH release changed from \"logstash-shipper-bosh-release\" to \"nxlog-boshrelease\"",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-08-06T09:19:09.501+0000",
    "modifiedAt" : "2015-08-06T09:19:09.501+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-08-06T09:13:00.889Z",
      "author" : "rene.welches@hybris.com",
      "content" : "<p>Hi Backing Service Teams,<br />\n<br />\nwe renamed the &nbsp;\"logstash-shipper-bosh-release\" to \"nxlog-boshrelease\". If you are using the \"logstash-shipper-bosh-release\" in your BOSH deployment, please change the reference.</p>\n\n<p>We also changed the properties in the manifest for deployments from</p>\n\n<pre style=\"background: rgb(238, 238, 238) none repeat scroll 0% 0%; border: 1px solid rgb(204, 204, 204); padding: 5px 10px;\">\n  logstash:\n        server: logstash.us-east.prod.cf.yaas.ninja:5000</pre>\n\n<p>to</p>\n\n<pre style=\"background: rgb(238, 238, 238) none repeat scroll 0% 0%; border: 1px solid rgb(204, 204, 204); padding: 5px 10px;\">\n  nxlog:\n    tcpoutput:\n      host: logstash.us-east.prod.cf.yaas.ninja\n      port: 5000</pre>\n\n<p>By changing it we are not anymore bound to logstash only and can use nxlog for anything else. If you have any questions please contact Maxime Desrosiers.</p>\n\n<p>Team Idefix</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Engineering"
    }
  },
  "id" : "55c32685a96eb999f87903f6"
}, {
  "sku" : "Enablebasicauthenticationforyourservices1439805006398",
  "name" : "Enable basic authentication for your services",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-08-17T09:51:01.715+0000",
    "modifiedAt" : "2015-08-17T09:51:01.715+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-08-17T09:43:40.053Z",
      "author" : "michael.stephan@sap.com",
      "content" : "<p>Dear all!</p>\n\n<p>please enable the basic authentication support for your services. All team POs should have received a mail from me some weeks ago. The mail contained the shared credentials we shall be using in the very beginning.</p>\n\n<p>&nbsp;</p>\n\n<p>In case of any questions please approach Andreas Hauke or me.</p>\n\n<p>Cheers,</p>\n\n<p>Michael</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Migrations"
    }
  },
  "id" : "55d1ae4ec8ee36191c439424"
}, {
  "sku" : "bla1438948764173",
  "name" : "Moving to AWS - Change of plan Update #1",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-08-07T12:05:48.594+0000",
    "modifiedAt" : "2015-08-07T12:05:48.594+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-08-07T11:59:06.486Z",
      "author" : "michael.stephan@sap.com",
      "content" : "<p>Dear all!</p>\n\n<p>things may have been communicated differently in yesterday's PO sync but following is the plan for next days.</p>\n\n<p>Actions required:</p>\n\n<ul>\n\t<li><strong>all teams:</strong> proceed with testing their currently installed AWS production services/ application (finish the testing activities latest until 11.08.2015)&nbsp;</li>\n\t<li><strong>me:</strong> inform teams via blog post if timelines have changed (10.08.2015 11:00 AM)</li>\n\t<li><strong>team Toad:</strong> finishes the implementation of TOAD-1921, TOAD-1871, TOAD-1874, TOAD-1975, TOAD-1899 which are changes required for rolling out the new organizational concept for YaaS (currently expected to be finished at 11.08.2015 05:00 PM CET)</li>\n\t<li><strong>all teams operating backing services:</strong> wipe all data from all backing services related to AWS production (please finish until 12.08.2015 12:00 AM)</li>\n\t<li><strong>team Toad:</strong> setup new organization structure and start inviting teams (happens latest until 12.08.2015 05:00 PM)</li>\n\t<li><strong>all teams:</strong> restore functionality and test</li>\n</ul>\n\n<p>If there are any further questions please contact us (Michael S, Andreas B.).</p>\n\n<p>Cheers,<br />\nMichael</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Migrations"
    }
  },
  "id" : "55c49d9bcb6e87045c69cdef"
}, {
  "sku" : "ReleaseNotesDeconstructed1439502329858",
  "name" : "Release Notes Deconstructed",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-08-13T21:57:34.112+0000",
    "modifiedAt" : "2015-08-13T21:57:34.112+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-08-13T21:45:12.014Z",
      "author" : "Kristi Herd",
      "content" : "<p><strong>Release Notes</strong></p>\n\n<p>Sure, you know how to write them. You probably write them all the time. But have you ever wondered what the actual <em>purpose</em> of release notes are? Believe it or not, it's not just a requirement that you frantically check off your list, scribbling down a blurb or two about some new feature, with&nbsp;no less than five seconds to spare before you&nbsp;release. Most times, your team just fixed some bugs, and there isn't really much to say about that. You're right, there isn't. But every now and then, there <em>is</em> something to say.</p>\n\n<p>So think about this -&nbsp;who reads the release notes? Well, a lot of folks read them. You do. Your team does. Other teams do. Our&nbsp;customers do... wait, customers! Customers have money... we want more money!&nbsp;Why not make our customers want to give us more money?! If you have a new feature or functionality, why not take every opportunity to advertise it, such as in an external release note?&nbsp;Do you see where I am going with this? Use release notes like a sales tool.&nbsp;If you can't think of anything more to write about a feature than a few words strung together, then customers will most likely pass it by, as well.&nbsp;</p>\n\n<p>Next time, make&nbsp;your release notes stand out. See examples of how to, hopefully, get more money from customers in the new <a href=\"/internal/docu_guide/releasenotes/index.html#ReleaseNotesGuidelines\">guidelines</a>.</p>\n\n<p><strong>New Metadata</strong></p>\n\n<p>Has the new&nbsp;metadata for release notes made&nbsp;your head spin? Don't fret, because it is actually easy to use, once you get the hang of it.&nbsp;This is an example of how to use the new metadata for an external release note. On the left is the actual file, and on the right is how the file is rendered on the Dev Portal:</p>\n\n<p><img alt=\"Example of new metadata in external release note\" src=\"/internal/docu_guide/releasenotes/img/RNs_external_service.png\" style=\"border-style:solid; border-width:1px; float:left; height:331px; margin-bottom:20px; margin-top:20px; width:1187px\" /></p>\n\n<p>&nbsp;</p>\n\n<p>There's no more blogger name, title, or area. Instead, there are very important fields for internal version (for internal release notes only), official version, and shutdown date. The shutdown date pertains to the official version, not the internal version, and it needs to be there to please the legal eagles.</p>\n\n<p>For more examples and updated templates, see the new release note&nbsp;<a href=\"/internal/docu_guide/releasenotes/index.html#ReleaseNotesRequirements\">requirements</a>.</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "News and Events"
    }
  },
  "id" : "55cd0fe117ae7c754745f48c"
}, {
  "sku" : "ServiceNamingConventionsYouractionrequired1439536501559",
  "name" : "Service Naming Conventions - Your action required!",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-08-17T18:13:29.542+0000",
    "modifiedAt" : "2015-08-17T18:13:29.542+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-08-14T07:09:07.218Z",
      "author" : "Andreas Bucksteeg",
      "content" : "<p>Dear YaaS,</p>\n\n<p>You know that nice and consistent APIs are one of the key things that make YaaS cool – and there’s one thing we neglected so far: the service names, as they are shown in the URL (example:&nbsp;<a href=\"https://api.yaas.io/\">https://api.yaas.io/</a><strong>product</strong>/b1/).</p>\n\n<ul>\n\t<li>Why is it called “algolia-search”, but “tax-avlara”?&nbsp;</li>\n\t<li>Why “repository” (without “document-“), but “media-repository” (and is there maybe a better word than “repository”?)</li>\n</ul>\n\n<p>&nbsp;To improve this, we finally came up with simple rules and conventions:</p>\n\n<ul>\n\t<li>Maximum 16 characters</li>\n\t<li>Lowercase alphanumeric characters and “-\" only</li>\n\t<li>Use “-“ to split&nbsp;implementations of the same interface or services of the same type. For example: tax-avlara</li>\n\t<li>call the 'standard' / out-of-the-box implementation just plainly 'shipping', 'tax' etc.</li>\n</ul>\n\n<p>The following services will get new names:</p>\n\n<ul>\n\t<li>Document repository: document instead of repository</li>\n\t<li>Media repository: media instead of media-repository</li>\n\t<li>Schema repository: schema instead of schema-repository</li>\n\t<li>Tax Flatrate: tax instead of tax-flatrate</li>\n\t<li>Alogila Search: search-algolia instead of index or search or whatever it is now</li>\n\t<li>if there is an algolia-spcific indexer, call it indexer-alogila or index-algolia</li>\n\t<li>Order Details: orderdetails instead of order-details</li>\n\t<li>Product Details: productdetails instead of product-details</li>\n\t<li>Site Settings Service: site instead of site-settings</li>\n</ul>\n\n<p>As we change the service names we also need to ensue the event names are aligned as well. Therefore please ensure that you</p>\n\n<p>Action items for service providers (starting now):</p>\n\n<ul>\n\t<li>Create a new API proxy for your services, with the new name as stated above. If you have ideas for a better name, get back to us</li>\n\t<li>In that new API proxy, change the names of the scopes, so that they match the service name\n\t<ul>\n\t\t<li>You can also use the Toad’s import/export tool for that</li>\n\t</ul>\n\t</li>\n\t<li>When you’re done, write release notes and tell the AWS move chat</li>\n</ul>\n\n<p>Action items for service consumers (starting now):</p>\n\n<ul>\n\t<li>Adjust the scopes you require in the Builder, and when getting an access token</li>\n\t<li>Change the addresses of the services you are calling (only relevant for calls over the proxy)</li>\n</ul>\n\n<p>Cleaning up, before the Open Beta (before 31.8.2015):</p>\n\n<ul>\n\t<li>remove the old API proxy</li>\n</ul>\n\n<p>For more naming conventions, check&nbsp;<a href=\"https://devportal.yaas.io/overview/REST/Naming.html\">https://devportal.yaas.io/overview/REST/Naming.html</a>. &nbsp;By the way, the other REST Best Practices are also worth reading ;)</p>\n\n<p>&nbsp;</p>\n\n<p><strong>Important:</strong></p>\n\n<ul>\n\t<li><strong>We will add the missing conventions for Event soon (today!)</strong></li>\n\t<li><strong>We will create a dedicated page for these&nbsp;naming conventions (Services &amp; Events) to a DevPortal and also link from the respective Builder Page to this document.&nbsp;</strong></li>\n\t<li><strong>Feedback welcome!</strong></li>\n</ul>\n\n<p>&nbsp;</p>\n\n<p>Wiederschaun,</p>\n\n<p>Reingehaun.</p>\n\n<p>Andreas</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Migrations"
    }
  },
  "id" : "55cd9575a88ed11babd7c886"
}, {
  "sku" : "Basicauthenticationenabledforwombatsservices1439818078087",
  "name" : "Basic authentication enabled for wombats services",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-08-17T13:30:23.334+0000",
    "modifiedAt" : "2015-08-17T13:30:23.334+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-08-17T13:18:52.495Z",
      "author" : "daniel.poloczek@hybris.com",
      "content" : "<p>Hi YaaS&nbsp;Devs,</p>\n\n<p>I would like to inform You&nbsp;that from now the direct access(via internal link) to all our services, on AWS PROD, is secured by basic authentication. Please use proxy calls instead of direct calls. In case you still need the direct access&nbsp;ask your POs for credentials.</p>\n\n<p>Affected services:</p>\n\n<p>- product</p>\n\n<p>- category</p>\n\n<p>- productdetails</p>\n\n<p>- shippingcost</p>\n\n<p>- pcm</p>\n\n<p>- search-algolia</p>\n\n<p>&nbsp;</p>\n\n<p>&nbsp;</p>\n",
      "tag" : "News and Events",
      "audience" : "Visible to Internal Only"
    }
  },
  "id" : "55d1e15ea88ed11babd7d36f"
}, {
  "sku" : "YaaSProductiononAmazonWebServices1439824102425",
  "name" : "YaaS Production on Amazon Web Services",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-08-18T09:32:24.006+0000",
    "modifiedAt" : "2015-08-18T09:32:24.006+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-08-17T15:07:47.949Z",
      "author" : "michael.stephan@sap.com",
      "content" : "<p>Dear all!<br />\n&nbsp;<br />\nYaaS.io will not be available or at least not fully functional from 19. to 20.08.2015 as we are finalizing the data center migration. From 21.08.2015 YaaS.io will be fully running on Amazon Web Services infrastructure. We are therefore technically on track for our Open Beta milestone due end of August. The old Monsoon YaaS based implementation will no longer be maintained and will be decommissioned in the near future.<br />\n&nbsp;<br />\nAfter completion of the move all CEC teams are welcome to install their services and applications. Starting from 21.08.2015, in case CEC teams face any infrastructure or functional issues, these need to be communicated to the YaaS teams through JIRA tickets (https://jira.hybris.com/browse/CFB).<br />\n&nbsp;<br />\nFollowing are the most important URLs each CEC team needs to know:<br />\n&nbsp;<br />\n* YaaS API endpoint: <a href=\"https://api.us-east.yaas.io/\">https://api.us-east.yaas.io/</a> (<a href=\"https://api.yaas.io/\">https://api.yaas.io/</a> can still be used)&nbsp;<br />\n* Cloud Foundry API endpoint: <a href=\"https://api.us-east.cf.yaas.io/\">https://api.us-east.cf.yaas.io/</a><br />\n&nbsp;<br />\nThis blog post focuses on the YaaS <strong>production environment</strong> only as YaaS stage is still being set up. Last minute changes to the plan will also be communicated via blog post.<br />\n&nbsp;<br />\nRegards,<br />\nThe YaaS team</p>\n",
      "tag" : "Migrations",
      "audience" : "Visible to All"
    }
  },
  "id" : "55d1f8a617ae7c7547460159"
}, {
  "sku" : "EventClientandScopeNamingConventionsYouractionrequired1439827448686",
  "name" : "Client, Event and Scope Naming Conventions - Your action required!",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-08-18T09:13:31.095+0000",
    "modifiedAt" : "2015-08-18T09:13:31.095+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-08-17T15:23:33.752Z",
      "author" : "Andreas Bucksteeg",
      "content" : "<p class=\"li1\">Service naming conventions were&nbsp;just one part of the story, as&nbsp;we also have Event, Client and Scope names in the YaaS world which also need to be consistent.</p>\n\n<ul class=\"ul1\">\n\t<li class=\"li1\"><span class=\"s2\"><strong>Client name</strong> convention will be&nbsp;</span><strong>&lt;organisation&gt;.&lt;servicename&gt;</strong><br />\n\t<span class=\"s2\"><span class=\"s2\">Client names&nbsp;must&nbsp;be unique, which implies (following the convention&nbsp;above) that service names must be unique within one organisation.</span></span><br />\n\t&nbsp;</li>\n\t<li class=\"li1\"><span class=\"s2\"><strong>Event topic name</strong> convention will be&nbsp;</span><strong>&lt;organisation&gt;.&lt;servicename&gt;.&lt;type&gt;</strong><br />\n\t<span class=\"s2\">As the new hybris Organisation Id is <strong>hybris</strong> the Event names should stay the same unless you changed to something different than hybris.</span><br />\n\t&nbsp;</li>\n\t<li class=\"li1\"><span class=\"s2\"><b>Scopes</b>&nbsp;name convention will be&nbsp;</span><strong>&lt;organisation&gt;. &lt;servicename&gt;&nbsp;_ &lt;scope&gt;</strong><br />\n\t<span style=\"line-height: 20.7999992370605px;\">As the new hybris Organisation Id is <strong>hybris</strong> the Scope&nbsp;names should stay the&nbsp;same (unless you changed to something different than hybris)</span></li>\n</ul>\n\n<p class=\"p1\">In case your team uses Client names which do not comply to the Client Name conventions, please check if you have&nbsp;to migrate data as you use the client for&nbsp;separating your data. Here is a list of examples when you would have to migrate your data<span class=\"s2\">:</span></p>\n\n<ul class=\"ul1\">\n\t<li class=\"li1\"><span class=\"s2\">All services and applications that keep data in <b>document or media repository</b> store it under path: /tenant/<b>client</b>/data or /tenant/<b>client</b>/mediaData part will be changed so all data stored with client <strong>&lt;team&gt;.&lt;service&gt;</strong> won’t be accessible for client <strong>&lt;org&gt;.&lt;service&gt;</strong>&nbsp;</span></li>\n\t<li class=\"li1\"><span class=\"s2\">Email templates stored for specific clients also won’t be available (/{tenant}/templates/{<b>client</b>})</span></li>\n\t<li class=\"li1\"><span class=\"s2\">Events that are already published using the team, instead of the organisation (/topics/{<b>topicOwnerClient</b>}/{eventType}/publish) - this should only affect the commerce teams, as far as we’re aware</span></li>\n\t<li class=\"li1\"><span class=\"s2\">Search, but this is currently not used by any service (/{tenant}/{<b>client</b>})</span></li>\n</ul>\n\n<p class=\"p1\"><span class=\"s2\">All tickets related to the implementation of these Naming Conventions&nbsp;should be linked here:&nbsp;<a href=\"https://jira.hybris.com/browse/YAAS-544\"><span class=\"s3\">https://jira.hybris.com/browse/YAAS-544</span></a>&nbsp;in order to&nbsp;make&nbsp;it easier for other teams to check what’s going on.</span></p>\n\n<p class=\"p2\">&nbsp;</p>\n\n<p class=\"p1\"><span class=\"s2\">Any questions? Ask the 'Moving to AWS' chat or Andrea Stubbe.</span></p>\n\n<p class=\"p1\"><span class=\"s2\">Andreas &amp; Co</span></p>\n",
      "tag" : "Migrations",
      "audience" : "Visible to Internal Only"
    }
  },
  "id" : "55d205f8c8ee36191c4395cc"
}, {
  "sku" : "ChangeYourServiceNameforDocumentationChecklist1439848268744",
  "name" : "Change Your Service Name for Documentation Checklist",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-08-19T08:17:11.733+0000",
    "modifiedAt" : "2015-08-19T08:17:11.733+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-08-17T21:16:37.548Z",
      "author" : "Kristi Herd",
      "content" : "<p>Concerning the requirement to standardize the naming of services in this <a href=\"/internal/blog/post/55cd9575a88ed11babd7c886\">post</a>, here is a quick checklist to make sure you cover all the bases when changing the service name for your documentation&nbsp;on the Dev Portal:</p>\n\n<ul>\n\t<li>Change the service name in the <a href=\"https://stash.hybris.com/projects/WOOKIEE/repos/devportal_registry/browse\">Dev Portal Registry</a>, including the \"name\" and \"builder_indentifier\". For example, change <strong>Media Repository</strong> to <strong>Media</strong>.</li>\n</ul>\n\n<pre>\n<code class=\"language-html\">{\n    \"builder_org\": \"hybris\",\n    \"name\": \"Media Repository\", &lt;!-- Changes to \"Media\" --&gt;\n    \"type\": \"services\",\n    \"area\": \"Core\",\n    \"source\": [\n        {\n            \"builder_identifier\": \"media-repository\", &lt;!-- Changes to \"media\" --&gt;\n            \"version\": \"b1\",\n            \"latest\": true,\n            \"location\": \"ssh://git@stash.hybris.com:7999/paas/media-repository.git\",\n            \"branch_or_tag\": \"develop\",\n            \"raml\": \"src/main/resources/api/media-repository-service.raml\" &lt;!-- Changes to media.raml --&gt;\n        }\n    ]\n}\n</code></pre>\n\n<p>Remember to do this three times for dev, stage, and prod branches for the Dev Portal Registry repository. Each registry works independently, and there is no merging of branches. Do this on the dev branch first and make sure everything displays properly before doing the same on stage and prod.</p>\n\n<ul>\n\t<li>Meanwhile, change the servcie metadata in <em>all</em> the files in the <strong>/docu</strong> folder. For example:</li>\n</ul>\n\n<pre>\n<code class=\"language-html\">---\narea: Core\ntitle: 'Overview'\nservice: 'Media Repository' &lt;!-- Changes to 'Media' --&gt;\n---</code></pre>\n\n<p>This includes changing all the Release Notes for the latest version, such as b1. You do not need to keep release notes for any older versions that are already shut down.</p>\n\n<ul>\n\t<li>\n\t<p>Change the name of all your partials, such as <strong>mediarepository_url.html</strong> to <strong>media_url.html</strong>. The partial should point to the latest version, such as: <strong>https://api.yaas.io/media/v2</strong>.</p>\n\t</li>\n\t<li>\n\t<p>Check all your documentation for any<strong> </strong><strong>broken links</strong>, references to old <strong>partials</strong>, and update any affected <strong>glossary</strong> terms. Update&nbsp;the <strong>RAML files</strong> to make sure the <strong>API Console</strong> and <strong>API Reference</strong> are also correct. Look at the list of services that are changing and update any links to other service documentation.</p>\n\t</li>\n\t<li>If you do not update the service metadata, but update the registry, or vice-versa, the documentation does not display. Merge your document changes to your stage environment together when you update the Dev Portal stage repository, and then do the same for the prod environment.</li>\n</ul>\n\n<p>&nbsp;</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Migrations"
    }
  },
  "id" : "55d2570417ae7c7547460385"
}, {
  "sku" : "ProductionDomainSwitch1439964971620",
  "name" : "Production Domain Switch!",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-08-19T06:16:34.766+0000",
    "modifiedAt" : "2015-08-19T06:16:34.766+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-08-19T06:13:09.939Z",
      "author" : "michael.stephan@sap.com",
      "content" : "<p>On 19.08.2015 (today) we will switch over the yaas.io domain to the new Amazon-based YaaS production setup. The only prerequisite is having done one successful subscription on the YaaS market. <strong>Everyone, please help making this happen and give the developers all the support (coffee-delivery, silence, help) they ask for.</strong></p>\n\n<p>If this can be accomplished we will start with the switch over latest at 01:00 PM CET.</p>\n\n<p>&nbsp;</p>\n\n<p>What implications does this have for our teams and also external users:</p>\n\n<p>&nbsp;</p>\n\n<p>On 19.08.2015:</p>\n\n<ul>\n\t<li>We will disable victorops notifications</li>\n\t<li>Monsoon-based YaaS production is not reachable anymore via yaas.io (if teams still need access they need to go through internal APIs hidden in corporate network)&nbsp;</li>\n\t<li>Teams proceed with fixing their services on AWS which are still reachable via yaas.ninja</li>\n\t<li>Teams fix their uptime checks and delete outdates ones (use <a href=\"https://uptime.yaas.io/\">https://uptime.yaas.io</a>). Checks shall still link agains yaas.ninja</li>\n</ul>\n\n<p>&nbsp;</p>\n\n<p>On 20.08.2015:</p>\n\n<ul>\n\t<li>Teams redeploy their services with updates configurations. Any links to yaas.ninja domains need to be changed to yaas.io</li>\n\t<li>We replace any&nbsp;uptime yaas.ninja checks with yaas.io</li>\n\t<li>We re-activate victorops notifications</li>\n\t<li>Yaas.io should point to the brand new YaaS setup and it should be fully functional;)</li>\n</ul>\n\n<p>In case you have further questions please approach us.</p>\n",
      "tag" : "Migrations",
      "audience" : "Visible to Internal Only"
    }
  },
  "id" : "55d41f2bd02e7b66cb284b64"
}, {
  "sku" : "Planneddowntimeofyaasio1439975450292",
  "name" : "Planned downtime of yaas.io",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "version" : 1,
    "createdAt" : "2015-08-19T09:10:50.328+0000",
    "modifiedAt" : "2015-08-19T09:10:50.328+0000"
  },
  "mixins" : {
    "post" : {
      "date" : "2015-08-19T09:08:53.023Z",
      "author" : "michael.stephan@sap.com",
      "content" : "<p>Dear all!</p>\n\n<p>Due to the planned and announced data center move yaas.io will not be available until 21.08.2015. Please approach the YaaS team if you have further questions.</p>\n\n<p>&nbsp;</p>\n\n<p>Regards,</p>\n\n<p>the YaaS team</p>\n",
      "audience" : "Visible to All",
      "tag" : "Migrations"
    }
  },
  "id" : "55d4481a7f4edd93bbfc5a52"
}, {
  "sku" : "PerformanceJenkinsavailableonAWS1439982651582",
  "name" : "Performance-Jenkins available on AWS",
  "published" : false,
  "metadata" : {
    "schema" : "https://api.yaas.io/hybris/schema/b2/hybriscommerce/Product.json",
    "mixins" : {
      "post" : "https://api.yaas.io/hybris/schema/b2/yaasblog/posts.v2.json"
    },
    "createdAt" : "2015-08-19T11:11:02.086+0000",
    "modifiedAt" : "2015-08-19T11:11:02.086+0000",
    "version" : 1
  },
  "mixins" : {
    "post" : {
      "date" : "2015-08-19T11:05:04.304Z",
      "author" : "rene.welches@hybris.com",
      "content" : "<p>We finished the setup of the performance test jenkins on AWS. You can access it under:</p>\n\n<div style=\"background:#eee;border:1px solid #ccc;padding:5px 10px;\">https://performance.us-east.tools.yaas.io/</div>\n\n<p>Please use your hybris crowd credentials to login. We also established the VPN connection to STASH, which means you will be able to run your performance test as you were used on Monsoon.&nbsp;</p>\n\n<p>If you are having any question please ping us.</p>\n\n<p>Team Idefix</p>\n",
      "audience" : "Visible to Internal Only",
      "tag" : "Engineering"
    }
  },
  "id" : "55d4643bc92e32d2eee11ab0"
} ]





}]);
