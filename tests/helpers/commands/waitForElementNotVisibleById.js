
exports.command = function (id, timeInMs) {

  const selector = `//*[@id = "${id}"]`;

  this
    .useXpath()
    .waitForElementNotVisible(selector, timeInMs);

  return this;
};
