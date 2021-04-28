/*!
 * set-value <https://github.com/jonschlinkert/set-value>
 *
 * Copyright (c) 2014-2018, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

require('mocha');
const split = require('split-string');
const assert = require('assert');
const set = require('./');

describe('set', function() {
  it('should return non-objects', function() {
    var res = set('foo', 'a.b', 'c');
    assert.equal(res, 'foo');
    res = set(null, 'a.b', 'c');
    assert.equal(res, null);
  });

  it('should create a nested property if it does not already exist', function() {
    const o = {};
    set(o, 'a.b', 'c');
    assert.equal(o.a.b, 'c');
  });

  it('should create a nested array if it does not already exist', function() {
    const o = {};
    set(o, 'a.0', 'c');
    set(o, 'a.1', 'd');
    assert(Array.isArray(o.a));
    assert.equal(o.a[0], 'c');
    let actual = "";
    o.a.map(i=> actual +=i);
    assert.equal(actual, "cd");
  });

  it('should merge an existing value with the given value', function() {
    var o = {a: {b: {c: 'd'}}};
    set(o, 'a.b', {y: 'z'}, { merge: true });
    assert.deepEqual(o.a.b, {c: 'd', y: 'z'});
  });

  it('should update an object value', function() {
    var o = {};
    set(o, 'a', {b: 'c'});
    set(o, 'a', {c: 'd'}, { merge: true });
    assert.deepEqual(o, {a: {b: 'c', c: 'd'}});
    set(o, 'a', 'b');
    assert.equal(o.a, 'b');
  });

  it('should extend an array', function() {
    const o = {a: []};
    set(o, 'a.0', {y: 'z'});
    assert(Array.isArray(o.a));
    assert.deepEqual(o.a[0], {y: 'z'});
  });

  it('should extend a function', function() {
    function log() {}
    const warning = function() {};
    const o = {};

    set(o, 'helpers.foo', log);
    set(o, 'helpers.foo.warning', warning);
    assert.equal(typeof o.helpers.foo, 'function');
    assert.equal(typeof o.helpers.foo.warning, 'function');
  });

  it('should extend an object in an array', function() {
    var o = {a: [{}, {}, {}]};
    set(o, 'a.0.a', {y: 'z'});
    set(o, 'a.1.b', {y: 'z'});
    set(o, 'a.2.c', {y: 'z'});
    assert(Array.isArray(o.a));
    assert.deepEqual(o.a[0].a, {y: 'z'});
    assert.deepEqual(o.a[1].b, {y: 'z'});
    assert.deepEqual(o.a[2].c, {y: 'z'});
  });

  it('should create an array if it does not already exist', function() {
    var o = {};
    set(o, 'a.0.a', {y: 'z'});
    set(o, 'a.1.b', {y: 'z'});
    set(o, 'a.2.c', {y: 'z'});
    assert(Array.isArray(o.a));
    assert.deepEqual(o.a[0].a, {y: 'z'});
    assert.deepEqual(o.a[1].b, {y: 'z'});
    assert.deepEqual(o.a[2].c, {y: 'z'});
  });

  it('should create a deeply nested property if it does not already exist', function() {
    var o = {};
    set(o, 'a.b.c.d.e', 'c');
    assert.equal(o.a.b.c.d.e, 'c');
  });

  it('should not create a nested property if it does already exist', function() {
    var first = {name: 'Halle'};
    var o = {a: first };
    set(o, 'a.b', 'c');
    assert.equal(o.a.b, 'c');
    assert.equal(o.a, first);
    assert.equal(o.a.name, 'Halle');
  });

  it('should support immediate properties', function() {
    var o = {};
    set(o, 'a', 'b');
    assert.equal(o.a, 'b');
  });

  it('should use property paths to set nested values from the source object.', function() {
    var o = {};
    set(o, 'a.locals.name', {first: 'Brian'});
    set(o, 'b.locals.name', {last: 'Woodward'});
    set(o, 'b.locals.name.last', 'Woodward');
    assert.deepEqual(o, { a: {locals: {name: { first: 'Brian' }} }, b: {locals: {name: { last: 'Woodward' }} }});
  });

  it('should add the property even if a value is not defined', function() {
    var fixture = {};
    assert.deepEqual(set(fixture, 'a.locals.name'), {a: {locals: { name: undefined }}});
    assert.deepEqual(set(fixture, 'b.locals.name'), {b: {locals: { name: undefined }}, a: {locals: { name: undefined }}});
  });

  it('should set the specified property.', function() {
    assert.deepEqual(set({a: 'aaa', b: 'b'}, 'a', 'bbb'), {a: 'bbb', b: 'b'});
  });

  it('should support passing an array as the key', function() {
    var actual = set({a: 'a', b: {c: 'd'}}, ['b', 'c', 'd'], 'eee');
    assert.deepEqual(actual, {a: 'a', b: {c: {d: 'eee'}}});
  });

  it('should set a deeply nested value.', function() {
    var actual = set({a: 'a', b: {c: 'd'}}, 'b.c.d', 'eee');
    assert.deepEqual(actual, {a: 'a', b: {c: {d: 'eee'}}});
  });

  it('should return the entire object if no property is passed.', function() {
    assert.deepEqual(set({a: 'a', b: {c: 'd'}}), {a: 'a', b: {c: 'd'}});
  });

  it('should set a value only.', function() {
    assert.deepEqual(set({a: 'a', b: {c: 'd'}}, 'b.c'), {a: 'a', b: {c: undefined}});
  });

  it('should set non-plain objects', function(done) {
    var o = {};

    set(o, 'a.b', new Date());
    var firstDate = o.a.b.getTime();

    setTimeout(function() {
      set(o, 'a.b', new Date());
      var secondDate = o.a.b.getTime();

      assert.notDeepEqual(firstDate, secondDate);
      done();
    }, 10);
  });
});

describe('escaping', function() {
  it('should not split escaped dots', function() {
    var o = {};
    set(o, 'a\\.b.c.d.e', 'c', { escape: true });
    assert.equal(o['a.b'].c.d.e, 'c');
  });

  it('should work with multiple escaped dots', function() {
    var obj1 = {};
    set(obj1, 'e\\.f\\.g', 1, { escape: true });
    assert.equal(obj1['e.f.g'], 1);

    var obj2 = {};
    set(obj2, 'e\\.f.g\\.h\\.i.j', 1, { escape: true });
    assert.deepEqual(obj2, { 'e.f': { 'g.h.i': { j: 1 } } });
  });

  it('should work with escaped dots as the last character', function() {
    var o = {};
    set(o, 'a\\.b.c.d\\.e\\.', 'c', { escape: true });
    assert.equal(o['a.b'].c['d.e.'], 'c');
  });
});

describe('options', function() {
  const options = {
    split: function(segment) {
      return split(segment, { separator: '.', brackets: true });
    }
  };

  it('should use a custom function to not split inside double quotes', function() {
    var o = {};
    set(o, 'a."b.c.d".e', 'c', options);
    assert.equal(o.a['b.c.d'].e, 'c');
  });

  it('should use a custom function to not split inside single quotes', function() {
    var o = {};
    set(o, "a.'b.c.d'.e", 'c', options);
    assert.equal(o.a['b.c.d'].e, 'c');
  });

  it('should use a custom function to not split inside square brackets', function() {
    var o = {};
    set(o, 'a.[b.c.d].e', 'c', options);
    assert.equal(o.a['[b.c.d]'].e, 'c');
  });

  it('should use a custom function to not split inside parens', function() {
    var o = {};
    set(o, 'a.(b.c.d).e', 'c', options);
    assert.equal(o.a['(b.c.d)'].e, 'c');
  });

  it('should use a custom function to not split inside angle brackets', function() {
    var o = {};
    set(o, 'a.<b.c.d>.e', 'c', options);
    assert.equal(o.a['<b.c.d>'].e, 'c');
  });

  it('should use a custom function to not split inside curly braces', function() {
    var o = {};
    set(o, 'a.{b.c.d}.e', 'c', options);
    assert.equal(o.a['{b.c.d}'].e, 'c');
  });
});

const Rx = require('rxjs');
const opers = require('rxjs/operators');

var _value = 0;
var o = {a: { b: {} } };
var obs = Rx.from(new Rx.BehaviorSubject()).pipe(
  opers.skip(1),
);

Object.defineProperty(o.a.b, 'c', {
  configurable: true,
  get() { return _value; },
  set(value) {
    _value = value;
    obs.next(value);
  }
});

describe('Setter with Observable', function() {
  // const expected = 11;
  var received = [];
  const noop = () => {};
  it('should only assign/emit once for each call of set', function(done) {
    var subs = obs.subscribe(
      data => { received.push(data); },
      noop,
      () => {
        assert.equal(received.length, 1);
        done();
      }
    );
    set(o, 'a.b.c', 5);
    subs.complete();
  });

  it('should work assignment via setter', function(done) {
    received = null;
    var subs = obs.subscribe(
      data => { received = data; },
      noop,
      () => {
        assert.equal(received, 10);
        done();
      }
    );
    set(o, 'a.b.c', 10);
    subs.complete();
  });

  it('should work with merge of object via setter', function(done) {
    received = null;
    set(o, 'a.b.c', {foo: 'bar'});
    var subs = obs.subscribe(
      data => { received = data; },
      noop,
      () => {
        assert.deepEqual(o.a.b.c, { foo: 'bar', bing: 'bong' });
        done();
      }
    );
    set(o, 'a.b.c', { bing: 'bong'}, {merge: true});
    subs.complete();
  });

});
