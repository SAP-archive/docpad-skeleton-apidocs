exports.command = function(selector) {

  this
    .useCss()
    .waitForElementVisible(selector)
    .execute(`$('${selector}').click();`);

  return this;
};
