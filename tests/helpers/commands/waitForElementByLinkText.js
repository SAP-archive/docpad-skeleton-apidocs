
exports.command = function (linkText, timeInMs) {

  const selector = `//a[text() = "${linkText}"]`;

  this
    .useXpath()
    .waitForElementVisible(selector, timeInMs);

  return this;
};
