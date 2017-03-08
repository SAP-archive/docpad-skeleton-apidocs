/*eslint prefer-arrow-callback: 0*/
exports.command = function (text, timeInMs) {

  this
    .execute(function() {
      window.history.back();
    });

  return this;
};
