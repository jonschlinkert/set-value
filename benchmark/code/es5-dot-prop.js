const set = require('es5-dot-prop').set;

module.exports = function(obj, path, value) {
  try {
    set(obj, path, value);
  } catch (err) {}
  return obj;
};
