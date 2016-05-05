'use strict';

const helper = require('../../helpers/testHelper.js');

const xPathFilterList = '//*[@id="singlePackageFilterList"]';
const xPathSearchBox = '//*[@id="apiFilterInput"]';
const xFilterList = '//*[@id="packageFilterList"]';
const xPathRN = '//a[text()="News"]';

let randomApiHeaders = [];
let randomApiPackages = [];
let notConsistentPair = [];
let consistentPair = [];
let randomTools = [];

module.exports = {

  before : () => {
    randomApiHeaders = helper.getTwoRandomApiHeaders();
    randomApiPackages = helper.getTwoRandomApiPackages();
    notConsistentPair = helper.getNotConsistentPair();
    consistentPair = helper.getConsistentPair();
    randomTools = helper.getTwoRandomTools();
  },

  beforeEach : (browser) => {
    browser
      .getHomePage()
      .useXpath()
      .moveToElement(xPathRN, 5, 5)
      .waitAndClickByLinkText('Release Notes');
  },

  'Should go to relase notes homepage': (browser) => {

    browser
      .waitForElementByClassName('nav-header')
      .useCss()
      .assert.containsText('.nav-header', 'Release Notes')
      .end();
  },

  'Should check if package filter is visible at first - it should not': (browser) => {

    browser
      .waitForElementNotVisibleById('packageFilterList')
      .end();
  },

  'should check if searching by topic package dropdown works + if its persistent': (browser) => {

    browser
      .waitForElementBySpanText(randomApiPackages[0])
      .waitForElementVisible(xPathFilterList)
      .setValue(xPathFilterList, ['APIs', browser.Keys.ENTER])
      .waitForElementVisible(xFilterList)
      .setValue(xFilterList, [randomApiPackages[0], browser.Keys.ENTER])
      .refresh()
      .setValue(xPathFilterList, ['Tools', browser.Keys.ENTER])
      .waitForElementByLinkText(randomTools[0])
      .refresh()
      .setValue(xPathFilterList, ['All Topics', browser.Keys.ENTER])
      .waitForElementBySpanText(randomApiPackages[0])
      .waitForElementBySpanText(randomApiPackages[1])
      .end();
  },

  'should check if search box works + if its persistent': (browser) => {

    browser
      .waitForElementBySpanText(randomApiPackages[0])
      .waitForElementByLinkText(randomApiHeaders[0])
      .setValue(xPathSearchBox, [randomApiHeaders[0], browser.Keys.ENTER])
      .waitForElementNotVisibleByLinkText(randomApiHeaders[1])
      .waitAndClickByLinkText(randomApiHeaders[0])
      .waitForElementByLinkText(randomApiHeaders[0])
      .waitForElementNotVisibleByLinkText(randomApiHeaders[1])
      .clearValue(xPathSearchBox)
      .setValue(xPathSearchBox, ['', browser.Keys.ENTER])
      .waitForElementByLinkText(randomApiHeaders[0])
      .waitForElementByLinkText(randomApiHeaders[1])
      .setValue(xPathSearchBox, [randomTools[0], browser.Keys.ENTER])
      .waitForElementNotVisibleByLinkText(randomTools[1])
      .waitAndClickByLinkText(randomTools[0])
      .end();
  },

  'should check if search box works + single drop down works together + persistent': (browser) => {


    browser
      .waitForElementByLinkText(randomApiHeaders[0])
      .waitForElementBySpanText(randomApiPackages[0])
      .setValue(xPathSearchBox, [consistentPair[0], browser.Keys.ENTER])
      .setValue(xPathFilterList, [consistentPair[1], browser.Keys.ENTER])
      .waitForElementNotVisibleByLinkText(notConsistentPair[0])
      .waitForElementBySpanText(consistentPair[1])
      .waitAndClickByLinkText(consistentPair[0])
      .waitForElementByLinkText(consistentPair[0])
      .clearValue(xPathSearchBox)
      .setValue(xPathSearchBox, ['', browser.Keys.ENTER])
      .setValue(xPathFilterList, ['All Topics', browser.Keys.ENTER])
      .waitForElementByLinkText(randomApiHeaders[0])
      .waitForElementByLinkText(notConsistentPair[0])
      .waitForElementByLinkText(randomTools[0])
      .end();
  },


  'should check if text search works after single package dropdown was deleted and then all headers show up after clearing text filter': (browser) => {

    browser
      .waitForElementByLinkText(notConsistentPair[0])
      .waitForElementBySpanText(notConsistentPair[1])
      .setValue(xPathSearchBox, [notConsistentPair[0], browser.Keys.ENTER])
      .waitForElementByLinkText(notConsistentPair[0])
      .setValue(xPathFilterList, ['APIs', browser.Keys.ENTER])
      .setValue(xFilterList, [notConsistentPair[1], browser.Keys.ENTER])
      .waitForElementNotVisibleByLinkText(notConsistentPair[0])
      .waitForElementNotVisibleBySpanText(randomApiPackages[1])
      .clearValue(xPathSearchBox)
      .setValue(xPathSearchBox, ['', browser.Keys.ENTER])
      .waitForElementBySpanText(notConsistentPair[1])
      .setValue(xPathFilterList, ['All Topics', browser.Keys.ENTER])
      .waitForElementByLinkText(notConsistentPair[0])
      .waitForElementBySpanText(notConsistentPair[1])
      .waitForElementByLinkText(randomTools[0])
      .end();
  }

};
