
exports.command = function (id, timeInMs) {

  const selector = `//*[contains(@class, '${id}')]`;

  this
    .useXpath()
    .waitForElementVisible(selector, timeInMs);

  return this;
};
