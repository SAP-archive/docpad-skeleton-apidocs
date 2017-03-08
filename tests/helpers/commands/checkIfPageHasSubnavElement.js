exports.command = function(elementToCompare1, elementToCompare2, equalizerNumber){

  this
    .elements('css selector', elementToCompare1, function func1(element1) {
      this.elements('css selector', elementToCompare2, function func2(element2) {
        const element1Length = element1.value.length;
        const element2Length = element2.value.length + equalizerNumber;

        this.assert.equal(element1Length, element2Length, 'checkIfPageHasSubnavElement assertion.');
      });
    });

  return this;
};
