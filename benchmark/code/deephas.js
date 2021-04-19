'use strict';

const { set } = require('deephas');

module.exports = (obj, path, value) => {
  try {
    set(obj, path, value);
  } catch (err) {
    // do nothing
  }
  return obj;
};
