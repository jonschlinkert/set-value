/*!
 * set-object <https://github.com/jonschlinkert/set-object>
 *
 * Copyright (c) 2014-2015 Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var isObject = require('isobject');
var get = require('get-value');

module.exports = function set(obj, prop, val) {
  if (prop == null) {
    return obj;
  }

  prop = prop.split('\\.').join('__ESC__');
  var parts = (/^(.+)\.(.+)$/).exec(prop);
  if (parts) {
    create(obj, parts[1])[parts[2]] = val;
  } else {
    prop = prop.split('__ESC__').join('.');
    obj[prop] = val;
    return obj;
  }
  return obj;
};

function create(obj, path) {
  if (!path) {
    return obj;
  }
  forEach(path.split('.'), function (key) {
    if (!obj[key] || !isObject(obj[key])) {
      obj[key] = {};
    }
    obj = obj[key];
  });
  return obj;
}

function forEach(arr, fn, thisArg) {
  if (arr == null) {
    return;
  }

  var len = arr.length;
  var i = 0;

  while (i < len) {
    if (fn.call(thisArg, arr[i++], i, arr) === false) {
      break;
    }
  }
}
