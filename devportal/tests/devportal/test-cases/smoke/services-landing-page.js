module.exports = {

  'Check services landing page': (browser) => {
    browser
      .getHomePage()
      .waitAndClickById('apis-topNav')
      .waitForElementByClassName('featured-items__img')
      .end();
  }
};
