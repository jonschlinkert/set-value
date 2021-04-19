'use strict';

const { set } = require('es5-dot-prop');

module.exports = (obj, path, value) => {
  try {
    set(obj, path, value);
  } catch (err) {
    // do nothing
  }
  return obj;
};

