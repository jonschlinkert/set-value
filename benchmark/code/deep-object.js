const set = require('deep-object').set;

module.exports = function(obj, path, value) {
  try {
    set(obj, path, value);
  } catch (err) {}
  return obj;
};
