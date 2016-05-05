'use strict';

const config = require('config');

function _getRandomNumber(maximumNumber) {
  return Math.floor((Math.random() * maximumNumber) + 1);
}

function _getRandomValueFromArray(arr) {
  if(!arr || arr.length === 0) return [];

  return arr[_getRandomNumber(arr.length - 1)];
}

function _getTwoRandomItemsFromArray(arr) {

  const items = [];
  let whileLoop = true;

  while(whileLoop) {
    const singleItem = _getRandomValueFromArray(arr);
    items.indexOf(singleItem) === -1 ? items.push(singleItem) : '';

    if(items.length === 2) whileLoop = false;
  }

  return items;
}

function getTwoRandomResources() {
  return _getTwoRandomItemsFromArray(config.get('resources'));
}

function getTwoRandomTools() {
  return _getTwoRandomItemsFromArray(config.get('tools'));
}

function getRandomApiHeader() {
  return _getRandomValueFromArray(config.get('apiDocsHeaders'));
}

function getRandomApiPackage() {
  return _getRandomValueFromArray(config.get('apiPackages'));
}

function getTwoRandomApiHeaders() {
  return _getTwoRandomItemsFromArray(config.get('apiDocsHeaders'));
}

function getTwoRandomApiPackages() {
  return _getTwoRandomItemsFromArray(config.get('apiPackages'));
}

function getNotConsistentPair() {
  return config.get('notConsistentPair');
}

function getConsistentPair() {
  return config.get('consistentPair');
}

const helpers = {
  getRandomApiHeader,
  getTwoRandomApiHeaders,
  getTwoRandomApiPackages,
  getNotConsistentPair,
  getConsistentPair,
  getRandomApiPackage,
  getTwoRandomTools,
  getTwoRandomResources
};

module.exports = helpers;
