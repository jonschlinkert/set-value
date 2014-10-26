/*!
 * set-object <https://github.com/jonschlinkert/set-object>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var isObject = require('isobject');
var get = require('get-value');

// module.exports = function set(o, path, value, fn) {
//   if (!path) {
//     return o;
//   }

//   var parts = path.split('.');
//   var len = parts.length;

//   for (var i = 0; i < len; i++) {
//     var key = parts[i];
//     if (!o[key]) {
//       o[key] = {};
//     }
//     o = o[key];
//   }
//   return o;
// };

// module.exports = function set(o, prop, value, cb) {
//   var arr = [].slice.call(arguments);
//   if (o == null || !isObject(o)) {
//     return {};
//   }
//   if (prop == null) {
//     return o;
//   }

//   if (typeof cb === 'function') {
//     fn = cb;
//   }

//   var path = fn(prop);
//   var last = path.pop();
//   var len = path.length;

//   o = get(o, prop, fn) || {};

//   if (o && typeof o === 'object') {
//     return (o[last] = value);
//   }
// };

// Set a deeply-nested property in an object, creating intermediary objects
// as we go.
module.exports = function set(obj, parts, value) {
  parts = parts.split('.');
  var prop = parts.pop();
  obj = get(obj, parts);

  console.log(obj)
  if (obj && typeof obj === 'object') {
    return (obj[prop] = value);
  }
};

// function fn(str) {
//   return str.split('.');
// }

function fn(str) {
  var tok = 'xzvZvzx'; // scrabble anyone?
  var path = repl(str, '\u005C.', tok);
  return path.split('.').map(function (seg) {
    return repl(seg, tok, '.');
  });
}

function repl(str, oldVal, newVal) {
  str = String(str);
  oldVal = String(oldVal);
  newVal = String(newVal);

  var pos = str.indexOf(oldVal);
  var len = oldVal.length;
  var prev;

  while (pos !== -1) {
    prev = str.substr(pos, len);
    str = str.replace(prev, newVal);
    pos = str.indexOf(prev);
  }
  return str;
}
