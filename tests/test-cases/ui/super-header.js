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
      .expectElementWithIdToHaveClass(solutions, activeClass)
      .goBack()
      .waitAndClickById(apis)
      .waitForElementById(apis)
      .expectElementWithIdToHaveClass(apis, activeClass)
      .goBack()
      .waitAndClickById(rn)
      .waitForElementById(rn)
      .expectElementWithIdToHaveClass(rn, activeClass)
      .end();
  }
};
