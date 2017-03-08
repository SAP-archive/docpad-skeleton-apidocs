
exports.command = function (text, timeInMs) {

  const selector = `//a[text() = "${text}"]`;

  this
    .useXpath()
    .waitForElementVisible(selector, timeInMs)
    .click(selector);

  return this;
};
