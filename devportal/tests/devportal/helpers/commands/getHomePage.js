
exports.command = function (endpoint) {

  this
    .url(this.launchUrl)
    .execute('$(".yg-cookie-bar__close").click()');

  return this;
};
