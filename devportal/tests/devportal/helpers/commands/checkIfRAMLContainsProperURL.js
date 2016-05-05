exports.command = function(){

  this
    .useXpath()
    .expect.element(`//*[@id = "raml-download-link"]`).to.have.attribute('href').which.contains('api.raml');

  return this;
};
