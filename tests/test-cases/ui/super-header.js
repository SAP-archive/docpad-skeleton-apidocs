'use strict';

module.exports = {

  'Check if active links work': (browser) => {

    const activeClass = 'active';
    const home = 'home-topNav';
    const solutions = 'solutions-topNav';
    const apis = 'apis-topNav';
    const rn = 'rn-topNav';

    browser
      .getHomePage()
      .waitForElementById(home)
      .waitAndClickById(solutions)
      .waitForElementById(solutions)
      .goBack()
      .waitAndClickById(apis)
      .waitForElementById(apis)
      .goBack()
      .waitAndClickById(rn)
      .waitForElementById(rn)
      .end();
  }
};
