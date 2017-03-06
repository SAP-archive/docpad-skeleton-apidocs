'use strict';

module.exports = {

  beforeEach : (browser) => {
    browser
      .getHomePage()
      .waitAndClickById('solutions-topNav');
  },

  'Check solutions page': (browser) => {

    const headerValue = 'Solutions',
      solutionName = 'Solution Ipsum';

    browser
      .assertContainsTextByClass('.jumbotron__title', headerValue)
      .assertContainsTextByClass('.nav-header', headerValue)
      .waitAndClickByLinkText(solutionName)
      .assertContainsTextByClass('.nav-header', headerValue)
      .assertContainsTextByClass('.pull-left', solutionName)
      .waitAndClickByLinkText('Back to Solutions')
      .assertContainsTextByClass('.nav-header', headerValue)
      .end();
  }
  
};
