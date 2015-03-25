/*!
 * set-value <https://github.com/jonschlinkert/set-value>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var isObject = require('isobject');
var nc = require('noncharacters');
var get = require('get-value');

module.exports = function set(obj, path, val) {
  if (path == null) {
    return obj;
  }

  path = escape(path);
  var seg = (/^(.+)\.(.+)$/).exec(path);

  if (seg) {
    create(obj, seg[1])[seg[2]] = val;
  } else {
    obj[path] = val;
    return obj;
  }
  return obj;
};

function create(obj, path) {
  if (!path) {
    return obj;
  }
  forEach(path.split('.'), function (key) {
    key = unescape(key);
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

function escape(str) {
  return str.split('\\.').join(nc[1]);
}

function unescape(str) {
  return str.split(nc[1]).join('.');
}
