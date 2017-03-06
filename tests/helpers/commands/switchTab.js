
exports.command = function (number) {

  this

    //wait, window may not be open yet
    .pause(1000)
    .window_handles(function(result) {
      const newHandle = result.value[number];
      this.switchWindow(newHandle);
    });

  return this;
};
