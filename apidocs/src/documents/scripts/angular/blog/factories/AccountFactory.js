'use strict'

app.factory('AccountFactory',['restAngularService','config', function(restAngularService, config){

    var accountFactory = {};

    var _getFirstLastName = function(login){
        var accountBased = restAngularService.AccountBased();
        return accountBased.one(config.accountUserInfoEndpoint() + '/' + login).get();
    }

    var _getUsersOfRole = function(role){
        var accountBased = restAngularService.AccountBased();
        //https://api.stage.yaas.io/hybris/account/v2/projects/devportalblog/members?roles=Publisher&pageNumber=1&pageSize=5&totalCount=true
        return accountBased.one(config.accountGetUsersRoleEndpoint()).customGET('', {roles: role, pageNumber: 1, pageSize: 1000, totalCount: true})
    }

    accountFactory.GetFirstLastName = _getFirstLastName;
    accountFactory.GetUsersOfRole = _getUsersOfRole;

    return accountFactory;
}])
