exports.command = function (idToClick) {

  this
    .waitAndClickById(idToClick)
    .waitAndClickById('register-button')
    .switchTab(1)
    .waitForElementById('signup-form')
    .closeWindow()
    .switchTab(0);

  return this;
};
