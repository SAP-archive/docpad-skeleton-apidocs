'use strict'

app.factory('LsCacheFactory', function(){

    var lsCacheFactory = {}

    //required for tests only
    var _setValue = function(value, time){
        lscache.set(value, time);
    }

    //required for tests only
    var _getValue = function(value){
        return lscache.get(value);
    }

    var _setToken = function(value){
        lscache.set('apiKey', value, 59);
    }

    var _getToken = function(){
        return lscache.get('apiKey');
    }

    var _setAnonKey = function(value){
        lscache.set('anonKey', value, 59);
    }

    var _getAnonToken = function(){
        return lscache.get('anonKey');
    }

    var _setAuthor = function(value){
        lscache.set('author', value, 59);
    }

    var _getAuthor = function(){
        return lscache.get('author');
    }

    var _setScopes = function(value){
        lscache.set('scopes', value, 59);
    }

    var _getScopes = function(){
        return lscache.get('scopes');
    }

    var _setPublisherUsers = function(users){
        lscache.set('publisherUsers',users, 59);
    }

    var _getPublisherUsers = function(){
        return lscache.get('publisherUsers');
    }

    var _setEmail = function(email){
        lscache.set('email', email, 59);
    }

    var _getEmail = function(){
        return lscache.get('email');
    }

    var _setTempEditPost = function(message){
        lscache.set('temp_edit_message', message);
    }

    var _setTempCreatePost = function(message){
        lscache.set('temp_create_post', message);
    }

    var _getTempCreatePost = function(){
        return lscache.get('temp_create_post');
    }

    var _getTempEditPost = function(){
        return lscache.get('temp_edit_message');
    }

    var _clearCredentials = function(){
      _setToken('');
      _setAuthor('');
    }

    lsCacheFactory.SetValue = _setValue;
    lsCacheFactory.GetValue = _getValue;

    lsCacheFactory.GetToken = _getToken;
    lsCacheFactory.SetToken = _setToken;

    lsCacheFactory.GetAuthor = _getAuthor;
    lsCacheFactory.SetAuthor = _setAuthor;

    lsCacheFactory.SetAnonKey = _setAnonKey;
    lsCacheFactory.GetAnonToken = _getAnonToken;

    lsCacheFactory.SetScopes = _setScopes;
    lsCacheFactory.GetScopes = _getScopes;
    lsCacheFactory.SetPublisherUsers = _setPublisherUsers;
    lsCacheFactory.GetPublisherUsers = _getPublisherUsers;

    lsCacheFactory.GetEmail = _getEmail;
    lsCacheFactory.SetEmail = _setEmail;

    lsCacheFactory.SetTempEditPost = _setTempEditPost;
    lsCacheFactory.SetTempCreatePost = _setTempCreatePost;
    lsCacheFactory.GetTempEditPost = _getTempEditPost;
    lsCacheFactory.GetTempCreatePost = _getTempCreatePost;

    lsCacheFactory.ClearCredentials = _clearCredentials;

    return lsCacheFactory;
})
