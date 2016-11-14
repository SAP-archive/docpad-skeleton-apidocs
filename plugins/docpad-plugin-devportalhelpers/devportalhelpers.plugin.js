/* eslint no-console: 0 */
'use strict';

module.exports = function (BasePlugin) {

  return BasePlugin.extend({

    // Plugin name
    name: 'devportalhelpers',

    generateBefore: function(opts) {
      let file, model;
      const ref = opts.collection.models;
      for (let i = 0; i < ref.length; i++) {
        model = ref[i];


        //validate release notes
        if (model.get('layout') === 'post' || model.get('layout') === 'internal_post') {
          if (model.get('layout') === 'internal_post') {
            model.set('layout', 'post');
          }
          if (!model.get('official_version') && model.get('relativeDirPath').search('services/') !== -1) {
            model.set('write', false);
            continue;
          }
          if (!model.get('service')) {
            model.set('write', false);
            continue;
          }
          file = this.docpad.getFile({
            relativePath: `${model.get('relativeDirPath')}/meta-inf`
          });
          if (file && file.attributes && file.attributes.version !== model.get('official_version') && model.get('relativeDirPath').search('services/') !== -1) {
            model.set('write', false);
            continue;
          }
          if (model.get('official_version') && model.get('internal_version') && model.get('layout') === 'post' && model.get('relativeDirPath').startsWith('internal')) {
            model.set('title', `${model.get('service')} ${model.get('official_version')} (${model.get('internal_version')})`);
          }
          else if (model.get('official_version') && model.get('layout') === 'post' && model.get('relativeDirPath').startsWith('internal')) {
            model.set('title', `${model.get('service')} ${model.get('official_version')}`);
          }
          else if (model.get('official_version') && model.get('layout') === 'post') {
            model.set('title', `${model.get('service')} ${model.get('official_version')}`);
          }
          else {
            model.set('title', model.get('service'));
          }
          if (model.get('previous_version_shutdown_date' && new Date(model.get('previous_version_shutdown_date')).toLocaleDateString() === 'Invalid Date')) {
            model.set('write', false);
            console.log('error', `\n\n\n\n\n${model.get('relativePath')} has broken date format and will not be generated in Dev Portal!\n\n\n\n\n`);
            continue;
          }
          if (model.get('date').toLocaleDateString() === 'Invalid Date') {
            model.set('write', false);
            console.log('error', `\n\n\n\n\n${model.get('relativePath')} has broken date format and will not be generated in Dev Portal!\n\n\n\n\n`);
          }

          if (!model.get('headline')) {
            model.set('write', false);
            console.log('error', `\n\n\n\n\n${model.get('relativePath')} has no headline metadata and will not be generated in Dev Portal!\n\n\n\n\n`);
          }

          /* if (!model.get('headline')){
            model.set('write', false);
            console.log('error', `\n\n\n\n\n${model.get('relativePath')} has no headline metadata and will not be generated in Dev Portal!\n\n\n\n\n`);
          } */
        }
      }
      return false;
    }
  });
};
