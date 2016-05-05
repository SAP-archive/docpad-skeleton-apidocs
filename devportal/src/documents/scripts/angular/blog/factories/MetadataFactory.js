'use strict'


app.factory('MetadataFactory', ['config', 'LsCacheFactory', function(config, LsCacheFactory){

    var metaFactory = {}
    var _getMixinsForSave = function() {
        return  {
            post: {
                date: new Date().toISOString(),
                author: LsCacheFactory.GetAuthor(),
                published: false
            }
        }
    }

    var _getMetadata = function () {
        return {
            mixins: {
                post: config.productSchema()
            }
        }
    }

    var _preparePostObject = function(){
        return  {
            metadata: _getMetadata(),
            mixins: _getMixinsForSave()
        }
    }

    metaFactory.PreparePostObject = _preparePostObject;
    metaFactory.GetMetadata = _getMetadata;

    return metaFactory;
}])
