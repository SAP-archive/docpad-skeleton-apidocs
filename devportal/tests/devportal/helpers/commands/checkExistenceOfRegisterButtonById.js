exports.command = function (idToClick) {

  this
    .waitAndClickById(idToClick)
    .waitAndClickById('register-button')
    .waitForElementById('signup-form')
    .goBack();

  return this;
};
