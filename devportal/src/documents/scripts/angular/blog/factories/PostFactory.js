'use strict'

app.factory('PostFactory',['restAngularService', 'config', 'helperService', function(restAngularService, config, helperService){

    var postFactory = {};

    var _getPosts = function(){
        var manageBased = restAngularService.Manage();
        return manageBased.all(config.tenant() + config.productEndpoint()).getList({pageSize: config.getPageSize()});
    }

    var _getPostsByAudience = function(section){
        var url = config.tenant() + config.productEndpoint() + section;
        var postBased = restAngularService.Post();
        return postBased.all(url).getList({pageSize: config.getPageSize()});
    }

    var _putPost = function(body){
        var manageBased = restAngularService.Manage(); 
        return manageBased.one(config.tenant() + config.productEndpoint(),helperService.GetPostIdFromRoute()).customPUT(body, undefined, undefined, undefined);
    }

    var _deletePost = function(){
        var manageBased = restAngularService.Manage();
        return manageBased.one(config.tenant() + config.productEndpoint(), helperService.GetPostIdFromRoute()).customDELETE(undefined);
    }

    var _getSinglePostByRouteId = function(id){
        var postBased = restAngularService.Post();
        return postBased.one(config.tenant() + config.productEndpoint(), id).get();

    }

    var _getSinglePostByRouteIdManage = function(id){
        var manageBased = restAngularService.Manage();
        return manageBased.one(config.tenant() + config.productEndpoint(), id).get();

    }

    var _createPost = function(body){
        var manageBased = restAngularService.Manage();
        return manageBased.all(config.tenant() + config.productEndpoint()).post(body);
    }


    postFactory.GetPosts = _getPosts;
    postFactory.GetPostsByAudience = _getPostsByAudience;
    postFactory.PutPost = _putPost;
    postFactory.GetSinglePostByRouteId = _getSinglePostByRouteId;
    postFactory.CreatePost = _createPost;
    postFactory.DeletePost = _deletePost;
    postFactory.GetSinglePostByRouteIdManage = _getSinglePostByRouteIdManage;
    return postFactory;

}])
