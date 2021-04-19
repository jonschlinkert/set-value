'use strict';

const parse = (input, options = {}) => {
  const { separator = '.' } = options;
  const segs = [];
  let seg = '';
  let i = 0;

  const next = () => input[++i];
  const peek = () => input[i + 1];

  for (; i < input.length; i++) {
    let s = input[i];
    if (s === '\\') {
      const val = next();
      if (val === separator) seg += val;
      continue;
    }

    if (s === '"' || s === "'") {
      const quote = s;
      s = '';
      while (i < input.length - 1) {
        let val = next();
        if (val === '\\') val += (next() || '');
        if (val === quote) break;
        s += val;
      }
    }

    if (s === separator) {
      segs.push(seg);
      seg = peek() === undefined ? separator : '';
      continue;
    }

    seg += s;
  }

  if (seg === separator) {
    segs[segs.length - 1] += seg;
  } else if (seg) {
    segs.push(seg);
  }

  return segs;
};

module.exports = parse;
