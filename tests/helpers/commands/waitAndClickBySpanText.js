
exports.command = function (text, timeInMs) {

  const selector = `//span[text() = "${text}"]`;

  this
    .useXpath()
    .waitForElementVisible(selector, timeInMs)
    .click(selector);

  return this;
};
