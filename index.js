/*!
 * set-value <https://github.com/jonschlinkert/set-value>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var isObject = require('isobject');
var nc = require('noncharacters');

module.exports = function setValue(obj, path, val) {
  if (path == null) {
    return obj;
  }
  path = escape(path);
  var seg = (/^(.+)\.(.+)$/).exec(path);

  if (seg) {
    create(obj, seg[1])[seg[2]] = val;
  } else {
    obj[unescape(path)] = val;
    return obj;
  }
  return obj;
};

function create(obj, path) {
  if (!path) return obj;
  var arr = path.split('.');
  var len = arr.length, i = 0;

  while (len--) {
    var key = unescape(arr[i++]);
    if (!obj[key] || !isObject(obj[key])) {
      obj[key] = {};
    }
    obj = obj[key];
  }
  return obj;
}

/**
 * Escape => `\\.`
 */
function escape(str) {
  return str.split('\\.').join(nc[1]);
}

/**
 * Unescaped dots
 */
function unescape(str) {
  return str.split(nc[1]).join('.');
}
