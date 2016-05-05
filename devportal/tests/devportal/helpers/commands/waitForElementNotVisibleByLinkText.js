
exports.command = function (linkText, timeInMs) {

  const selector = `//a[text() = "${linkText}"]`;

  this
    .useXpath()
    .waitForElementNotVisible(selector, timeInMs);

  return this;
};
