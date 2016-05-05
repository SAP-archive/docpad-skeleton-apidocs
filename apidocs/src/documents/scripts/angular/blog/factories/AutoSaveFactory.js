'use strict'

app.factory('AutoSaveFactory', ['config', '$interval', 'LsCacheFactory', 'helperService', function(config, $interval, LsCacheFactory, helperService){

    var autoSaveFactory = {};

    //Method creates interval which is responsible for auto-saving content on post creation
    var _createSaveIntervalCreate = function(post){
        return $interval(function(){
            LsCacheFactory.SetTempCreatePost({
                content: post.mixins.post.content,
                audience: post.mixins.post.audience,
                name: post.name,
                tag: post.mixins.post.tag});
        }, config.AutoSaveInterval());
    }

    //Method creates interval which is responsible for auto-saving content on post edition.
    //Editing scenario is more complex, thats why we additionally need modifiedAt and id property
    var _createSaveIntervalEdit = function(post){
        return $interval(function(){
            LsCacheFactory.SetTempEditPost({
                content: post.mixins.post.content,
                audience: post.mixins.post.audience,
                name: post.name,
                tag: post.mixins.post.tag,
                modifiedAt: (new Date()).toISOString(),
                id: helperService.GetPostIdFromRoute()
            });
        }, config.AutoSaveInterval());
    }

    //fill out post object with localStorage provided value
    var _fillOutCreatePost = function(post){

        var temp_obj = LsCacheFactory.GetTempCreatePost();
        if(temp_obj){
            post.mixins.post.content = temp_obj.content;
            post.mixins.post.audience = temp_obj.audience;
            post.name = temp_obj.name;
            post.mixins.post.tag = temp_obj.tag;
        };
    };

    //Method fill out post object with value stored at localStorage or with initialValue if its provided (I didnt want to make 2 functions out of that).
    //If initialValue is provided, we use it otherwise we reach localStorage
    var _fillOutEditPost = function(post, initialValue){
        var temp_obj = LsCacheFactory.GetTempEditPost();

        if(initialValue) {
            post.mixins.post.content = initialValue.mixins.post.content;
            post.mixins.post.audience = initialValue.mixins.post.audience;
            post.name = initialValue.name;
            post.mixins.post.tag = initialValue.mixins.post.tag;
        }
        else if(temp_obj) {
            post.mixins.post.content = temp_obj.content;
            post.mixins.post.audience = temp_obj.audience;
            post.name = temp_obj.name;
            post.mixins.post.tag = temp_obj.tag;

        }

    };

    //Checks if property modifiedAt of original post is earlier than date saved in object at localStorage(autoSaved) - we have to prediect such situation,
    //because we dont want to load saved value if content of original post has been changed since then.
    var _checkLastModifiedConditions = function(post){
        var postModifiedAt = Date.parse(post.metadata.modifiedAt);
        var temp_obj = LsCacheFactory.GetTempEditPost();
        var tempPostModifiedAt = temp_obj ? Date.parse(temp_obj.modifiedAt) : null;
        var id = helperService.GetPostIdFromRoute();

        var objEqual = temp_obj ? (post.mixins.post.content.trim() === temp_obj.content.trim() && post.mixins.post.audience === temp_obj.audience && post.mixins.post.tag === temp_obj.tag && post.name === temp_obj.name ? true : false) : false;

        return !tempPostModifiedAt ? false : (postModifiedAt > tempPostModifiedAt && temp_obj.id === id);
    };

    //Checking whether we have to load value stored at localStorage.
    var _checkFilloutConditions = function(post, initialPost){

        var temp_obj = LsCacheFactory.GetTempEditPost();
        var tempPostModifiedAt = temp_obj ? Date.parse(temp_obj.modifiedAt) : null;
        var postModifiedAt = Date.parse(post.metadata.modifiedAt);
        var id = helperService.GetPostIdFromRoute();

        //to change .. Other way didnt work out for now ;/
        var objEqual = temp_obj ? (post.mixins.post.content.trim() === temp_obj.content.trim() && post.mixins.post.audience === temp_obj.audience && post.mixins.post.tag === temp_obj.tag && post.name === temp_obj.name ? true : false) : false;

        return temp_obj && !_checkLastModifiedConditions(post) && temp_obj.id === id && !objEqual ? true : false;

    };

    autoSaveFactory.CreateSaveIntervalCreate = _createSaveIntervalCreate;
    autoSaveFactory.CreateSaveIntervalEdit = _createSaveIntervalEdit;
    autoSaveFactory.FillOutCreatePost = _fillOutCreatePost;
    autoSaveFactory.FillOutEditPost = _fillOutEditPost;
    autoSaveFactory.CheckFilloutConditions = _checkFilloutConditions;
    autoSaveFactory.CheckLastModifiedConditions = _checkLastModifiedConditions;

    return autoSaveFactory;
}]);
