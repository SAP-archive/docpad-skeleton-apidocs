'use strict';

// Export Plugin
const pathUtil = require('path');
const ref = require('taskgroup'), Task = ref.Task, TaskGroup = ref.TaskGroup;
const fs = require('fs');

module.exports = function (BasePlugin) {

    // Define Plugin
  const partials = {};
  const resultPartials = {};
  const simplePartials = {};

  return BasePlugin.extend({

    // Plugin name
    name: 'simplepartials',

    renderDocument: function(opts, next) {

      const docpadConfig = this.docpad.getConfig();
      const partialsPath = pathUtil.resolve(docpadConfig.srcPath, 'partials');

      const partialContainerRegex = /\[partial:([^\]]+)\]/g;
      const partialContainers = (opts.content || '').match(partialContainerRegex) || [];

      if(!partialContainers.length) return next();

      const filePath = opts.file.getFilePath();

      const tasks = new TaskGroup(`Partials for ${filePath}`, {
        concurrency: 0
      }).done(() => {
        partialContainers.forEach((container) => {
          opts.content = opts.content.replace(partialContainerRegex, (match, partialId) => {
            const partial = resultPartials[partialId];
            delete resultPartials[partialId];
            return partial;
          });
        });
        next();
      });

      partialContainers.forEach((container) => {
        const partialId = container.replace(partialContainerRegex, '$1');
        if(!partials[partialId].inQueue) {
          tasks.addTask(partials[partialId].task);
          partials[partialId].inQueue = true;
        }
      });
      tasks.run();

    },

    populateCollections: function(opts, next) {
      const docpad = this.docpad;
      const docpadConfig = docpad.getConfig();
      const partialsPath = pathUtil.resolve(docpadConfig.srcPath, 'partials');

      docpad.parseDocumentDirectory({
        path: partialsPath
      }, next);
    },

    extendCollections: function(opts) {
      const docpad = this.docpad;
      const docpadConfig = docpad.getConfig();
      const partialsPath = pathUtil.resolve(docpadConfig.srcPath, 'partials');
      const locale = this.locale;
      const database = docpad.getDatabase();

      docpad.setCollection('partials', database.createLiveChildCollection().setQuery('isPartial', {
        $or: {
          isPartial: true,
          fullPath: {
            $startsWith: partialsPath
          }
        }
      }).on('add', (model) => {
        return model.setDefaults({
          isPartial: true,
          render: false,
          write: false
        });
      }));
    },

    writeAfter: function(){
      const docpadConfig = this.docpad.getConfig();
      const partialsPath = pathUtil.resolve(docpadConfig.srcPath, 'partials');
      const path = `${partialsPath}/generated`;

      deleteFolderRecursive(path);
    },

    renderAfter: function(opts){

      const docpadConfig = this.docpad.getConfig();
      const partialsPath = pathUtil.resolve(docpadConfig.srcPath, 'partials');

      const simplePartialContainerRegex = /\[simple_partial:([^\]]+)\]/g;

      opts.collection.models.forEach((model) => {
        const simplePartialContainers = (model.get('contentRendered') || '').match(simplePartialContainerRegex) || [];

        if(simplePartialContainers.length){

          simplePartialContainers.forEach((container) => {
            const content = model.get('contentRendered').replace(simplePartialContainerRegex, (match, partialId) => {
              return simplePartials[partialId] || `Partial ${partialId} doesn't exist`;
            });

            model.set('contentRendered', content);
          });
        }
      });
    },

    extendTemplateData: function(template) {
      const self = this;
      const docpad = this.docpad;
      const docpadConfig = docpad.getConfig();
      const partialsPath = pathUtil.resolve(docpadConfig.srcPath, 'partials');
      template.templateData.partial = function(partialName, templateData) {
        let partial = {};

        const partialFuzzyPath = pathUtil.join(partialsPath, partialName);
        partial.document = docpad.getCollection('partials').fuzzyFindOne(partialFuzzyPath);

        if(!partial.document){
          return `Partial ${partialName} doesn't exist`;
        }

        if(!templateData){

          if(simplePartials[partialName]) return `[simple_partial:${partialName}]`;
          templateData = Object.assign(templateData || {}, this);

          docpad.renderDocument(partial.document, {
            templateData: templateData
          }, (err, result, document) => {
            simplePartials[partialName] = result;
          });

          partial = null;
          return `[simple_partial:${partialName}]`;

        }

        partial.partialName = partialName;
        const id = Math.random();
        const container = `[partial:${id}]`;

        templateData = Object.assign(templateData || {}, this);

        partial.task = new Task(`renderPartial: ${partialName}`, (complete) => {

          if(partials[id] && partials[id].result) return complete();

          docpad.renderDocument(partial.document, {
            templateData: templateData
          }, (err, result, document) => {
            resultPartials[id] = result;
            delete partials[id];
            return complete(err);
          });

        });

        partials[id] = partial;

        return container;
      };
    }
  });
};

function deleteFolderRecursive(path) {

  if( fs.existsSync(path) ) {

    fs.readdirSync(path).forEach((file, index) => {
      const curPath = `${path}/${file}`;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      }
      else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}
