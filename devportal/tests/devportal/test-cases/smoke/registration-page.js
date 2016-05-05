module.exports = {

  'Registration flow check': (browser) => {

    const xPathRegister = '//header//a[text() = "Register"]';
    const xPathNews = '//a[text() = "Release Notes"]';

    browser
      .getHomePage()
      .waitAndClickById('register-button')
      .waitForElementById('signup-form')
      .goBack()

      //Checking Register link under My Account section - after hover link
      .waitForElementByLinkText('My Account')
      .moveToElement('//a[text()="My Account"]', 5, 5)
      .waitForElementVisible(xPathRegister)
      .click(xPathRegister)
      .waitForElementById('signup-form')
      .goBack()

      //Generic function for check if at page register button exists&work
      .checkExistenceOfRegisterButtonById('tools-topNav')
      .checkExistenceOfRegisterButtonById('overview-topNav')
      .checkExistenceOfRegisterButtonById('getting-started-topNav')
      .checkExistenceOfRegisterButtonById('apis-topNav')
      .goBack()
      .end();
  }
};
