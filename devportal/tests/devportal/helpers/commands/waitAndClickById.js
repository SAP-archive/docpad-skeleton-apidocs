
exports.command = function (id, timeInMs) {

  const selector = `//*[@id = "${id}"]`;

  this
    .useXpath()
    .waitForElementVisible(selector, timeInMs)
    .click(selector);

  return this;
};
