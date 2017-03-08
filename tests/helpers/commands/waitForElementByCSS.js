exports.command = function(selector) {

  this
    .useCss()
    .waitForElementVisible(selector)

  return this;
};
