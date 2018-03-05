const set = require('deep-property').set;

module.exports = function(obj, path, value) {
  try {
    set(obj, path, value);
  } catch (err) {}
  return obj;
};
