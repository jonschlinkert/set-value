'use strict';

const set = require('.');

const data = {};
const key1 = Symbol('key-1');
const key2 = Symbol('key-2');
const key3 = Symbol('key-3');
const key4 = Symbol('key-4');

set(data, 'a.b.c', true);
set(data, '"a.b".c', true, { split: set.parse });
set(data, 'foo-bar', true);
set(data, ['one', 'two'], true);
set(data, ['one', key1], true);
set(data, [key2, key3, key4], true);
set(data, key1, true);

console.log(data);

// console.log(set({}, 'a.b.c', 'd'));
// //=> { a: { b: { c: 'd' } } }

// console.log(set({}, 'a\\.b.c', 'd'));
// //=> { 'a.b': { c: 'd' } }

// console.log(set({}, 'a\\.b\\.c', 'd'));
// //=> { 'a.b.c': 'd' }

// console.log(set({}, '"a.b".c', 'd'));
// //=> { 'a.b': { c: 'd' } }

// console.log(set({}, "'a.b'.c", "d"));
// //=> { 'a.b': { c: 'd' } }

// console.log(set({}, "{a..b}.c", "d"));
// //=> { '{a..b}': { c: 'd' } }

// console.log(set({}, '"this/is/a/.file.path"', 'd'));
// //=> { 'this/is/a/.file.path': 'd' }
