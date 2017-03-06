exports.command = function(className, expectedNumber){

  this
    .elements('css selector', className, function checkNumberOfElements(elementToCheck) {
        const element1Length = elementToCheck.value.length;
        const element2Length = expectedNumber;

        this.assert.equal(element1Length, element2Length, 'expectCertainNumberOfElements assertion.');
    });

  return this;
};
