/* eslint no-var: 0 prefer-arrow-callback: 0, prefer-template: 0, no-inner-declarations: 0 */

var gulp = require('gulp');
var fs = require('fs');
var mkmeta = require('marked-metadata');
var tap = require('gulp-tap');
var path = require('path');
var ysYaml = require('js-yaml');


function validateMetadata(path) {

  var valid = true;
  var content = fs.readFileSync(path, 'utf8');
  var occurences = allIndexOf(content, '---');
  var metaData = content.substring(occurences[0] + 3, occurences[1]);

  try {
    ysYaml.safeLoad(metaData);
  }
  catch (e) {
    valid = false;
  }

  return valid;
}


function allIndexOf(str, strToSearch) {

  var indices = [];
  var pos;

  for(pos = str.indexOf(strToSearch); pos !== -1; pos = str.indexOf(strToSearch, pos + 1)) {
    indices.push(pos);
  }

  return indices;
}

function validateMetaDataByPath(next) {
  const url = './src/documents/**/*.*';

  gulp.src(url)
    .pipe(tap(function(file, t){

      var ext = path.extname(file.path);
      if(ext !== '.md' && ext !== '.eco' && ext !== '.html') return;

      var md = new mkmeta(file.path);
      try {
        md = md.metadata();

        if(!validateMetadata(file.path)) {
          fs.unlink(file.path);
          console.log('File '  + file.path + ' has been excluded from build due to invalid metadata.');
        }

      }
      catch(e) {

        //it means that we process file which doesnt have metadata
        return t;
      }
      return t;
    }))
    .on('end', next);
}

module.exports = validateMetaDataByPath;
