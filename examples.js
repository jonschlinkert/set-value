'use strict';

const set = require('.');

const key1 = Symbol('key-1');
const key2 = Symbol('key-2');
const key3 = Symbol('key-3');
const key4 = Symbol('key-4');

const log = o => console.dir(o, { depth: null });

log(set({}, key1, true));
log(set({}, [key2, key3, key4], true));
log(set({}, 'a.b.c', true));
log(set({}, 'a\\.b\\.c.d', true));
log(set({}, ['one.two', 'three', key1], true));
log(set({}, ['one:two', key2, 'three'], true, { separator: ':', elSplit: true }));
log(set({}, 'uno\\.dos%tres/quatro.cinco', true, { separator: '%./' }));

// log(set({}, 'a.b.c', 'd'));
// //=> { a: { b: { c: 'd' } } }

// log(set({}, 'a\\.b.c', 'd'));
// //=> { 'a.b': { c: 'd' } }

// log(set({}, 'a\\.b\\.c', 'd'));
//=> { 'a.b.c': 'd' }

// log(set({}, '"a.b".c', 'd'));
// //=> { 'a.b': { c: 'd' } }

// log(set({}, "'a.b'.c", "d"));
// //=> { 'a.b': { c: 'd' } }

// log(set({}, "{a..b}.c", "d"));
// //=> { '{a..b}': { c: 'd' } }

// log(set({}, '"this/is/a/.file.path"', 'd'));
//=> { 'this/is/a/.file.path': 'd' }
