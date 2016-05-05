
exports.command = function (cssClass, value) {

  this
    .useCss()
    .waitForElementVisible(cssClass)
    .assert.containsText(cssClass, value);

  return this;
};
