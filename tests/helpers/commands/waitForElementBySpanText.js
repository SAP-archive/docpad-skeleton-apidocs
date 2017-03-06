
exports.command = function (linkText, timeInMs) {

  const selector = `//span[text() = "${linkText}"]`;

  this
    .useXpath()
    .waitForElementVisible(selector, timeInMs);

  return this;
};
