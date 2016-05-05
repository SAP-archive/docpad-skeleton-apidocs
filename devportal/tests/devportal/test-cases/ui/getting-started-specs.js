/* eslint prefer-arrow-callback: 0 */

module.exports = {
  'should check if you can click through GS': (browser) => {

    browser
      .getHomePage()
      .assert.title('Home | YaaS Dev Portal')
      .waitAndClickByLinkText('Getting Started')
      .assertContainsTextByClass('.nav-header', 'Getting Started')
      .waitAndClickByLinkText('Create a Service')
      .waitForElementByClassName('nav-header')
      .assert.title('Create a Service | YaaS Dev Portal')

      .waitAndClickById('step-2')
      .waitAndClickById('step-3')
      .waitAndClickById('step-4')
      .waitAndClickById('step-5')
      .waitAndClickById('step-6')
      .assert.urlContains('#6')

      .executeClickByClassName('.prev_btn')
      .executeClickByClassName('.prev_btn')
      .executeClickByClassName('.prev_btn')
      .executeClickByClassName('.prev_btn')
      .executeClickByClassName('.prev_btn')
      .assert.urlContains('#1')

      .end();
  },

  'should check if single document doesnt have dropdown': (browser) => {
    browser
      .getHomePage()
      .waitAndClickByLinkText('Getting Started')
      .assertContainsTextByClass('.nav-header', 'Getting Started')
      .waitAndClickByLinkText('Prerequisites')
      .waitForElementByClassName('nav-header')
      .assert.title('Prerequisites | YaaS Dev Portal')
      .useXpath()
      .waitForElementNotVisibleById('step-1')
      .end();
  }
};
