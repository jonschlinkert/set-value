var set = require('./');

console.log(set({}, 'a.b.c', 'd'));
//=> { a: { b: { c: 'd' } } }

console.log(set({}, 'a\\.b.c', 'd'));
//=> { 'a.b': { c: 'd' } }

console.log(set({}, 'a\\.b\\.c', 'd'));
//=> { 'a.b.c': 'd' }

console.log(set({}, '"a.b".c', 'd'));
//=> { 'a.b': { c: 'd' } }

console.log(set({}, "'a.b'.c", "d"));
//=> { 'a.b': { c: 'd' } }

console.log(set({}, "{a..b}.c", "d"));
//=> { '{a..b}': { c: 'd' } }

console.log(set({}, '"this/is/a/.file.path"', 'd'));
//=> { 'this/is/a/.file.path': 'd' }
