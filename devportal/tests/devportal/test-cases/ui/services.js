'use strict';

const helper = require('../../helpers/testHelper.js');

module.exports = {
  'should check if API Docs rendered properly': (browser) => {

    const releaseNotesXpath = `//nav/a[text() = "Release Notes"]`;
    const service = 'Account';
    browser

      //go to given service
      .getHomePage()
      .waitAndClickById('apis-topNav')
      .waitForElementVisible(`//a[@data-builder-identifier = "${service.toLowerCase()}"]`)

      //.click('//a[@data-builder-identifier = "account"]')
      .execute(`$('*[data-builder-identifier=${service.toLowerCase()}]')[0].click();`)
      .waitForElementByClassName('sticky-page-header')
      .assertContainsTextByClass('.nav-header', service)

      .useXpath()
      .waitForElementVisible(releaseNotesXpath)
      .click(releaseNotesXpath)
      .useCss()
      .waitForElementVisible('.release-notes-header h3')
      .assert.containsText('.release-notes-header h3', `RELEASE NOTES/ ${service}`)
      .assert.urlContains(`rn/services/${service.toLowerCase()}`)
      .goBack()

      //check if api console button exists
      .waitForElementByClassName('sticky-page-header')
      .waitAndClickByLinkText('API CONSOLE')

      //check if apiconsole exists
      .useXpath()
      .waitForElementVisible(`//raml-console`)
      .assert.urlContains(`/services/${service.toLowerCase()}/latest/apiconsole.html`)
      .goBack()

      .waitAndClickById('api-spec-btn')
      .waitForElementById('raml-download-link')
      .checkIfRAMLContainsProperURL()

      //check if there is API Reference
      .waitForElementById('ApiReference')
      .end();
  }
};
