/*!
 * set-value <https://github.com/jonschlinkert/set-value>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

'use strict';

require('mocha');
var assert = require('assert');
var set = require('./');

describe('set', function() {
  it('should return non-objects', function() {
    var res = set('foo', 'a.b', 'c');
    assert.equal(res, 'foo');
  });

  it('should create a nested property if it does not already exist:', function() {
    var o = {};
    set(o, 'a.b', 'c');
    assert.equal(o.a.b, 'c');
  });

  it('should extend an existing value:', function() {
    var o = {a: {b: {c: 'd'}}};
    set(o, 'a.b', {y: 'z'});
    assert.deepEqual(o.a.b, {c: 'd', y: 'z'});
  });

  it('should update an object value:', function() {
    var o = {};
    set(o, 'a', {b: 'c'});
    set(o, 'a', {c: 'd'});
    assert.deepEqual(o, {a: {b: 'c', c: 'd'}});
    set(o, 'a', 'b');
    assert.equal(o.a, 'b');
  });

  it('should extend an array:', function() {
    var o = {a: []};
    set(o, 'a.0', {y: 'z'});
    assert(Array.isArray(o.a));
    assert.deepEqual(o.a[0], {y: 'z'});
  });

  it('should extend a function:', function() {
    function log() {}
    var warning = function() {};
    var o = {};

    set(o, 'helpers.foo', log);
    set(o, 'helpers.foo.warning', warning);
    assert.equal(typeof o.helpers.foo, 'function');
    assert.equal(typeof o.helpers.foo.warning, 'function');
  });

  it('should extend an object in an array:', function() {
    var o = {a: [{}, {}, {}]};
    set(o, 'a.0.a', {y: 'z'});
    set(o, 'a.1.b', {y: 'z'});
    set(o, 'a.2.c', {y: 'z'});
    assert(Array.isArray(o.a));
    assert.deepEqual(o.a[0].a, {y: 'z'});
    assert.deepEqual(o.a[1].b, {y: 'z'});
    assert.deepEqual(o.a[2].c, {y: 'z'});
  });

  it('should create a deeply nested property if it does not already exist:', function() {
    var o = {};
    set(o, 'a.b.c.d.e', 'c');
    assert.equal(o.a.b.c.d.e, 'c');
  });

  it('should not create a nested property if it does already exist:', function() {
    var first = {name: 'Halle'};
    var o = {a: first };
    set(o, 'a.b', 'c');
    assert.equal(o.a.b, 'c');
    assert.equal(o.a, first);
    assert.equal(o.a.name, 'Halle');
  });

  it('should support immediate properties:', function() {
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

  it('should add the property even if a value is not defined:', function() {
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
  it('should recognize escaped dots:', function() {
    var o = {};
    set(o, 'a\\.b.c.d.e', 'c');
    assert.equal(o['a.b'].c.d.e, 'c');
  });

  it('should work with multple escaped dots:', function() {
    var obj1 = {};
    set(obj1, 'e\\.f\\.g', 1);
    assert.equal(obj1['e.f.g'], 1);

    var obj2 = {};
    set(obj2, 'e\\.f.g\\.h\\.i.j', 1);
    assert.deepEqual(obj2, { 'e.f': { 'g.h.i': { j: 1 } } });
  });
});
