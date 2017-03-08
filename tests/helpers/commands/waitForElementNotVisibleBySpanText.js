
exports.command = function (linkText, timeInMs) {

  const selector = `//span[text() = "${linkText}"]`;

  this
    .useXpath()
    .waitForElementNotVisible(selector, timeInMs);

  return this;
};
