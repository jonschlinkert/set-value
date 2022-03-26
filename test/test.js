'use strict';

require('mocha');
const split = require('split-string');
const assert = require('assert');
const set = require('..');

describe('set-value', () => {
  describe('unsafe properties', () => {
    it('should not allow setting constructor', () => {
      assert.throws(() => set({}, 'a.constructor.b', 'c'));
      assert.throws(() => set({}, 'a.constructor', 'c'));
      assert.throws(() => set({}, 'constructor', 'c'));
    });

    it('should not allow setting prototype', () => {
      assert.throws(() => set({}, 'a.prototype.b', 'c'));
      assert.throws(() => set({}, 'a.prototype', 'c'));
      assert.throws(() => set({}, 'prototype', 'c'));
    });

    it('should not allow setting __proto__', () => {
      assert.throws(() => set({}, 'a.__proto__.b', 'c'));
      assert.throws(() => set({}, 'a.__proto__', 'c'));
      assert.throws(() => set({}, '__proto__', 'c'));
    });
  });

  describe('set', () => {
    it('should return non-objects', () => {
      const str = set('foo', 'a.b', 'c');
      assert.equal(str, 'foo');
      const _null = set(null, 'a.b', 'c');
      assert.equal(_null, null);
    });

    it('should set when key is a symbol', () => {
      const key = Symbol('foo');
      const obj = {};
      set(obj, key, 'bar');
      assert.equal(obj[key], 'bar');
    });

    it('should set on the root of the object', () => {
      const o = {};
      set(o, 'foo', 'bar');
      assert.equal(o.foo, 'bar');
    });

    it('should set the specified property.', () => {
      assert.deepEqual(set({ a: 'aaa', b: 'b' }, 'a', 'bbb'), { a: 'bbb', b: 'b' });
    });

    it('should set a nested property', () => {
      const o = {};
      set(o, 'a.b', 'c');
      assert.equal(o.a.b, 'c');
    });

    it('should set a nested property where the last key is a symbol', () => {
      const o = {};
      set(o, 'a.b', 'c');
      assert.equal(o.a.b, 'c');
    });

    it('should support passing an array as the key', () => {
      const actual = set({ a: 'a', b: { c: 'd' } }, ['b', 'c', 'd'], 'eee');
      assert.deepEqual(actual, { a: 'a', b: { c: { d: 'eee' } } });
    });

    it('should set a deeply nested value.', () => {
      const actual = set({ a: 'a', b: { c: 'd' } }, 'b.c.d', 'eee');
      assert.deepEqual(actual, { a: 'a', b: { c: { d: 'eee' } } });
    });

    it('should allow keys to be whitespace', () => {
      const o = {};
      set(o, 'a. .a', { y: 'z' });
      assert.deepEqual(o.a[' '].a, { y: 'z' });
    });

    it('should extend an array', () => {
      const o = { a: [] };
      set(o, 'a.0', { y: 'z' });
      assert(Array.isArray(o.a));
      assert.deepEqual(o.a[0], { y: 'z' });
    });

    it('should create an array if it does not already exist', () => {
      const o = {};
      set(o, 'a.0.a', { y: 'z' });
      set(o, 'a.1.b', { y: 'z' });
      set(o, 'a.2.c', { y: 'z' });
      set(o, 'b.0', { y: 'z' });
      set(o, '0', { y: 'z' });
      assert(Array.isArray(o.a));
      assert.deepEqual(o.a[0].a, { y: 'z' });
      assert.deepEqual(o.a[1].b, { y: 'z' });
      assert.deepEqual(o.a[2].c, { y: 'z' });
      assert.deepEqual(o.b, [{ y: 'z' }]);
      assert.deepEqual(o['0'], { y: 'z' });
    });

    it('should extend a function', () => {
      const log = () => {};
      const warning = () => {};
      const o = {};

      set(o, 'helpers.foo', log);
      set(o, 'helpers.foo.warning', warning);
      assert.equal(typeof o.helpers.foo, 'function');
      assert.equal(typeof o.helpers.foo.warning, 'function');
    });

    it('should extend an object in an array', () => {
      const o = { a: [{}, {}, {}] };
      set(o, 'a.0.a', { y: 'z' });
      set(o, 'a.1.b', { y: 'z' });
      set(o, 'a.2.c', { y: 'z' });
      assert(Array.isArray(o.a));
      assert.deepEqual(o.a[0].a, { y: 'z' });
      assert.deepEqual(o.a[1].b, { y: 'z' });
      assert.deepEqual(o.a[2].c, { y: 'z' });
    });

    it('should not delete number properties from an object', ()=>{
      const o = { a: { 0: 'foo', 1: 'bar' } }
      set(o, 'a.0', 'baz')
      assert.deepEqual(o, { a: { 0: 'baz', 1: 'bar' } })
    })

    it('should create an array if the target is null', ()=>{
      const o = { a: null }
      set(o, 'a.0', 'baz')
      assert.deepEqual(o, { a: ['baz'] })
    })

    it('should create an array if the target is not an array or object', ()=>{
      const o = { a: false, b: undefined, c: 5 }
      set(o, 'a.0', 'foo')
      set(o, 'b.0', 'bar')
      set(o, 'c.0', 'baz')
      assert.deepEqual(o, { a: ['foo'], b: ['bar'], c: ['baz'] })
    })

    it('should create a deeply nested property if it does not already exist', () => {
      const o = {};
      set(o, 'a.b.c.d.e', 'c');
      assert.equal(o.a.b.c.d.e, 'c');
    });

    it('should not create a nested property if it does already exist', () => {
      const first = { name: 'Halle' };
      const o = { a: first };
      set(o, 'a.b', 'c');
      assert.equal(o.a.b, 'c');
      assert.equal(o.a, first);
      assert.equal(o.a.name, 'Halle');
    });

    it('should support immediate properties', () => {
      const o = {};
      set(o, 'a', 'b');
      assert.equal(o.a, 'b');
    });

    it('should use property paths to set nested values from the source object.', () => {
      const o = {};
      set(o, 'a.locals.name', { first: 'Brian' });
      set(o, 'b.locals.name', { last: 'Woodward' });
      set(o, 'b.locals.name.last', 'Woodward');
      assert.deepEqual(o, { a: { locals: { name: { first: 'Brian' } } }, b: { locals: { name: { last: 'Woodward' } } } });
    });

    it('should delete the property when value is undefined', () => {
      const fixture = {};
      assert.deepEqual(set(fixture, 'a.locals.name'), { a: { locals: {} } });
      assert.deepEqual(set(fixture, 'b.locals.name'), { b: { locals: {} }, a: { locals: {} } });
      assert.deepEqual(set({ a: 'a', b: { c: 'd' } }, 'b.c'), { a: 'a', b: {} });
    });

    it('should return the entire object if no property is passed.', () => {
      assert.deepEqual(set({ a: 'a', b: { c: 'd' } }), { a: 'a', b: { c: 'd' } });
    });

    it('should set non-plain objects', done => {
      const o = {};

      set(o, 'a.b', new Date());
      const firstDate = o.a.b.getTime();

      setTimeout(function() {
        set(o, 'a.b', new Date());
        const secondDate = o.a.b.getTime();

        assert.notDeepEqual(firstDate, secondDate);
        done();
      }, 10);
    });
  });

  describe('escaping', () => {
    it('should not split escaped dots', () => {
      const o = {};
      set(o, 'a\\.b.c.d.e', 'c');
      assert.equal(o['a.b'].c.d.e, 'c');
    });

    it('should support multiple escaped dots', () => {
      const obj1 = {};
      set(obj1, 'e\\.f\\.g', 1);
      assert.equal(obj1['e.f.g'], 1);

      const obj2 = {};
      set(obj2, 'e\\.f.g\\.h\\.i.j', 1);
      assert.deepEqual(obj2, { 'e.f': { 'g.h.i': { j: 1 } } });
    });

    it('should support multiple escaped dots', () => {
      const obj1 = {};
      const key = Symbol('key');
      set(obj1, [key, 'e.f', 'g'], 1);
      assert.equal(obj1[key]['e.f'].g, 1);

      const obj2 = {};
      set(obj2, 'e\\.f.g\\.h\\.i.j', 1);
      assert.deepEqual(obj2, { 'e.f': { 'g.h.i': { j: 1 } } });
    });

    it('should correctly parse multiple consecutive backslashes', () => {
      assert.deepEqual(set.split('a.b.c'), ['a', 'b', 'c']);
      assert.deepEqual(set.split('b\\.c\\.d'), ['b.c.d']);
      assert.deepEqual(set.split('b\\\\.c\\.d'), ['b\\', 'c.d']);
      assert.deepEqual(set.split('a.b\\.c'), ['a', 'b.c']);
      assert.deepEqual(set.split('a.b\\\\.c'), ['a', 'b\\', 'c']);
      assert.deepEqual(set.split('a.b\\\\\\.c'), ['a', 'b\\.c']);
    });
  });

  describe('options.merge', () => {
    it('should merge an existing value with the given value', () => {
      const o = { a: { b: { c: 'd' } } };
      set(o, 'a.b', { y: 'z' }, { merge: true });
      assert.deepEqual(o.a.b, { c: 'd', y: 'z' });

      const obj = { foo: { bar: { baz: 'qux' } } };
      set(obj, 'foo.bar.fez', 'zzz', { merge: true });
      assert.deepEqual(obj, { foo: { bar: { baz: 'qux', fez: 'zzz' } } });
    });

    it('should update an object by merging values', () => {
      const o = {};
      set(o, 'a', { b: 'c' });
      set(o, 'a', { c: 'd' }, { merge: true });
      assert.deepEqual(o, { a: { b: 'c', c: 'd' } });
      set(o, 'a', 'b');
      assert.equal(o.a, 'b');
    });
  });

  describe('options.preservePaths', () => {
    it('should split properties with a forward slash when preservePaths is false', () => {
      const obj = {};
      set(obj, 'https://github.com', true, { preservePaths: false });

      assert.deepEqual(obj, { 'https://github': { com: true } });
    });

    it('should not split properties with a forward slash', () => {
      const obj = {};
      set(obj, 'foo/bar/baz.md', 'c');
      assert.equal(obj['foo/bar/baz.md'], 'c');
    });
  });

  describe('options.split', () => {
    const keep = (value, state) => {
      return value !== '"' && value !== '\'';
    };

    const options = {
      split(prop) {
        return split(prop, { separator: '.', brackets: true, quotes: true, keep });
      }
    };

    it('should use simple String.split() when options.split is not defined', () => {
      const o = {};
      set(o, 'a."b.c.d".e', 'c');
      assert.equal(o.a['"b'].c['d"'].e, 'c');
    });

    it('should take a custom separator', () => {
      const o = {};
      set(o, 'a/b/c/d/e', 'c', { separator: '/' });
      assert.equal(o.a.b.c.d.e, 'c');
    });

    it('should use a custom function to not split inside double quotes', () => {
      const o = {};
      set(o, 'a."b.c.d".e', 'c', options);
      assert.equal(o.a['b.c.d'].e, 'c');
    });

    it('should use a custom function to not split inside single quotes', () => {
      const o = {};
      set(o, "a.'b.c.d'.e", 'c', options);
      assert.equal(o.a['b.c.d'].e, 'c');
    });

    it('should use a custom function to not split inside square brackets', () => {
      const o = {};
      set(o, 'a.[b.c.d].e', 'c', options);
      assert.equal(o.a['[b.c.d]'].e, 'c');
    });

    it('should use a custom function to not split inside parens', () => {
      const o = {};
      set(o, 'a.(b.c.d).e', 'c', options);
      assert.equal(o.a['(b.c.d)'].e, 'c');
    });

    it('should use a custom function to not split inside angle brackets', () => {
      const o = {};
      set(o, 'a.<b.c.d>.e', 'c', options);
      assert.equal(o.a['<b.c.d>'].e, 'c');
    });

    it('should use a custom function to not split inside curly braces', () => {
      const o = {};
      set(o, 'a.{b.c.d }.e', 'c', options);
      assert.equal(o.a['{b.c.d }'].e, 'c');
    });
  });
});
