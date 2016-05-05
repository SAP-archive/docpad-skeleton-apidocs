'use strict'

app.factory('AuthFactory', ['restAngularService', 'config', 'helperService', '$q', 'AccountFactory', 'LsCacheFactory', function(restAngularService, config, helperService, $q, AccountFactory, LsCacheFactory){
    var authFactory = {};
    var accountBased = restAngularService.AccountBased();
    var oAuthBased = restAngularService.OAuthBased();

    var _getAnonKey = function(){
        return accountBased.one(config.accountEndpoint()).get({
            "client_id": config.clientId(),
            "redirect_uri": config.redirect_uri()
        }, {});
    }

    var _getAuthor = function(){

        var q = $q.defer();
        return $q(function(resolve, reject){

            oAuthBased.one(config.userInfoEndpoint()).get('',{'Authorization': 'Bearer '+ lscache.get('apiKey') }).then(function(response){
                var login = response.sub;
                //TODO: do it better... Fixing production bug about checking publisher users, this line should be somewhere else ;)
                LsCacheFactory.SetEmail(login);
                //end
                AccountFactory.GetFirstLastName(login).then(function(res){
                    //if we have lastname and/or firstname written in builder account => save it as a author of posts
                    var firstName = res.firstName;
                    var lastName = res.lastName;

                    if(firstName || lastName){
                        resolve(helperService.PrepareAuthor(firstName, lastName));
                        return q;
                    } else{
                        resolve(login);
                        return q;
                    }
                }, function(){
                    resolve(login);
                    return q;
                })

            }, function(){
                reject("reject");
                return q;
            })

        })

    }

    authFactory.GetAnonKey = _getAnonKey;
    authFactory.GetAuthor = _getAuthor;
    return authFactory;

}])