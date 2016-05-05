/* eslint guard-for-in: 0 */
'use strict';
(function() {
  Array.prototype.unique = function() {
    let j, key, output, ref, results, value;
    output = {};
    for (key = j = 0, ref = this.length; 0 <= ref ? j < ref : j > ref; key = 0 <= ref ? ++j : --j) {
      output[this[key]] = this[key];
    }
    results = [];
    for (key in output) {
      value = output[key];
      results.push(value);
    }
    return results;
  };

  Array.prototype.uniqueArr = function() {
    let a, i, l, u;
    u = {};
    a = [];
    i = 0;
    l = this.length;
    while (i < l) {
      if (u.hasOwnProperty(this[i][1])) {
        ++i;
        continue;
      }
      a.push(this[i]);
      u[this[i][1]] = 1;
      ++i;
    }
    return a;
  };

  Array.prototype.uniqueArrByTitle = function() {
    let array, i, output, unique;
    unique = {};
    output = [];
    array = this;
    for (i in array) {
      if (typeof unique[array[i].title] === 'undefined') {
        output.push(array[i]);
      }
      unique[array[i].title] = 0;
    }
    return output;
  };

  String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
})();
