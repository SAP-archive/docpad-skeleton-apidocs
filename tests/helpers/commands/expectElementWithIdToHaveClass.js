exports.command = function(elementId, elementClass){
  const selector = `//a[@id='${elementId}' and @class='${elementClass}']`;

  this
  .useXpath()
    .waitForElementPresent(selector, 5000, 'Element %s was visible after %d ms');

  return this;
};
