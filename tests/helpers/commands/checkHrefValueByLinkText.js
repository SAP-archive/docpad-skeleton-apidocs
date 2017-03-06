exports.command = function(text, hrefText){

  this
    .useXpath()
    .expect.element(`//a[text()="${text}"]`).to.have.attribute('href').which.contains(hrefText);

  return this;
};
