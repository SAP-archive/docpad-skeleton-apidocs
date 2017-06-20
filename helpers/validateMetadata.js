'use strict';

require('babel-core/register');
require('babel-polyfill');
const gulp = require('gulp');
const fs = require('fs');
const tap = require('gulp-tap');
const path = require('path');
const ysYaml = require('yamljs');
const logger = require('wookiee-utils').logger;


function validateMetadata(path) {
  const content = fs.readFileSync(path, 'utf8');

  //in case of any questions about regex:
  //https://github.com/docpad/docpad/blob/master/src/lib/models/document.coffee

  const normalizedContent = content.replace(/\r\n?/gm, '\n');
  const regex = /^\s*[^\n]*?(([^\s\d\w])\2{2,})(?:\x20*([a-z]+))?([\s\S]*?)[^\n]*?\1[^\n]*/;
  const result = regex.exec(content);
  
  if(!result) return true; //doesnt have metadata, shouldnt be erased
  const metaData = result[4].trim();
  const normalizedMetaData = metaData.replace(/\t/g, '    '); //YAML doesn't support tabs that well
  try {
    ysYaml.parse(normalizedMetaData);
  }
  catch (e) {
    logger.warn(`File ${path} has been excluded from build due to invalid metadata.`, e);
    return false;
  }

  return true;
}

function validateMetaDataByPath(next) {
  const url = './src/documents/**/*.*';

  gulp.src(url)
    .pipe(tap((file, t) => {

      const ext = path.extname(file.path);
      if(ext !== '.md' && ext !== '.eco' && ext !== '.html') return;

      if(!validateMetadata(file.path)) {
        fs.unlink(file.path);
      }

      return t;
    }))
    .on('end', next);
}

module.exports = validateMetaDataByPath;