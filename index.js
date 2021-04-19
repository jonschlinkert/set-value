/*!
 * set-value <https://github.com/jonschlinkert/set-value>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

const isPlainObject = require('is-plain-object');

const isObject = val => {
  return (typeof val === 'object' && val !== null) || typeof val === 'function';
};

const isUnsafeKey = key => {
  return key === '__proto__' || key === 'constructor' || key === 'prototype';
};

const validateKey = key => {
  if (isUnsafeKey(key)) {
    throw new Error(`Cannot set unsafe key: "${key}"`);
  }
};

const toString = input => {
  return Array.isArray(input) ? input.flatMap(String).join(',') : input;
};

const createMemoKey = (input, options) => {
  if (typeof input !== 'string' || !options) return input;
  let key = input + ';';
  if (options.separator) key += `separator=${options.separator};`;
  if (options.split) key += `split=${options.split};`;
  if (options.merge) key += `merge=${options.merge};`;
  if (options.preservePaths) key += `preservePaths=${options.preservePaths};`;
  return key;
};

const memoize = (input, options, fn) => {
  const key = toString(options ? createMemoKey(input, options) : input);
  validateKey(key);

  const val = setValue.cache.get(key) || fn();
  setValue.cache.set(key, val);
  return val;
};

const splitString = (input, options) => {
  const opts = options || {};
  const sep = opts.separator || '.';
  const preserve = sep === '/' ? false : opts.preservePaths;

  if (typeof input === 'symbol') {
    return [input];
  }

  if (typeof opts.split === 'function') {
    return opts.split(input);
  }

  const keys = Array.isArray(input) ? input : input.split(sep);

  for (let i = 0; i < keys.length; i++) {
    if (typeof keys[i] !== 'string' || (keys[i + 1] && typeof keys[i + 1] !== 'string')) break;

    if (preserve !== false && /\//.test(input)) {
      return [input];
    }

    while (keys[i] && i < keys.length && keys[i].endsWith('\\')) {
      keys[i] = keys[i].slice(0, -1) + sep + keys.splice(i + 1, 1);
    }
  }

  return keys;
};

const split = (input, options) => {
  return memoize(input, options, () => splitString(input, options));
};

const setProp = (obj, prop, value, options) => {
  validateKey(prop);

  // Delete property when "value" is undefined
  if (value === undefined) {
    delete obj[prop];

  } else if (options && options.merge) {
    const merge = options.merge === true ? Object.assign : options.merge;

    // Only merge plain objects
    if (merge && isPlainObject(obj[prop]) && isPlainObject(value)) {
      obj[prop] = merge(obj[prop], value);
    } else {
      obj[prop] = value;
    }

  } else {
    obj[prop] = value;
  }

  return obj;
};

const setObject = (obj = {}, keys = [], value, options) => {
  const len = keys.length;
  const target = obj;

  for (let i = 0; i < len; i++) {
    const key = keys[i];

    validateKey(key);

    if (i === len - 1) {
      setProp(obj, key, value, options);
      break;
    }

    if (!isObject(obj[key])) {
      obj[key] = {};
    }

    obj = obj[key];
  }

  return target;
};

const setValue = (target, path, value, options) => {
  if (!path) return target;

  if (isObject(target)) {
    setObject(target, split(path, options), value, options);
    return target;
  }

  return target;
};

setValue.cache = new Map();
setValue.clear = () => {
  setValue.cache = new Map();
};

setValue.parse = require('./parse');
module.exports = setValue;
