/*!
 * set-value <https://github.com/jonschlinkert/set-value>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('mocha');
var assert = require('assert');
var should = require('should');
var set = require('./');

describe('set', function() {
  it('should return non-objects', function() {
    var res = set('foo', 'a.b', 'c');
    assert(res === 'foo');
  });

  it('should create a nested property if it does not already exist:', function() {
    var o = {};
    set(o, 'a.b', 'c');
    o.a.b.should.equal('c');
  });

  it('should extend an existing value:', function() {
    var o = {a: {b: {c: 'd'}}};
    set(o, 'a.b', {y: 'z'});
    o.a.b.should.eql({c: 'd', y: 'z'});
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
    o.a[0].should.eql({y: 'z'});
  });

  it('should extend an object in an array:', function() {
    var o = {a: [{}, {}, {}]};
    set(o, 'a.0.a', {y: 'z'});
    set(o, 'a.1.b', {y: 'z'});
    set(o, 'a.2.c', {y: 'z'});
    assert(Array.isArray(o.a));
    o.a[0].a.should.eql({y: 'z'});
    o.a[1].b.should.eql({y: 'z'});
    o.a[2].c.should.eql({y: 'z'});
  });

  it('should create a deeply nested property if it does not already exist:', function() {
    var o = {};
    set(o, 'a.b.c.d.e', 'c');
    o.a.b.c.d.e.should.equal('c');
  });

  it('should not create a nested property if it does already exist:', function() {
    var first = {name: 'Halle'};
    var o = {a: first };
    set(o, 'a.b', 'c');
    o.a.b.should.equal('c');
    o.a.should.equal(first);
    o.a.name.should.equal('Halle');
  });

  it('should support immediate properties:', function() {
    var o = {};
    set(o, 'a', 'b');
    o.a.should.equal('b');
  });

  it('should use property paths to set nested values from the source object.', function () {
    var o = {};
    set(o, 'a.locals.name', {first: 'Brian'});
    set(o, 'b.locals.name', {last: 'Woodward'});
    set(o, 'b.locals.name.last', 'Woodward');
    o.should.eql({ a: {locals: {name: { first: 'Brian' }} }, b: {locals: {name: { last: 'Woodward' }} }});
  });

  it('should add the property even if a value is not defined:', function () {
    var fixture = {};
    set(fixture, 'a.locals.name').should.eql({a: {locals: { name: undefined }}});
    set(fixture, 'b.locals.name').should.eql({b: {locals: { name: undefined }}, a: {locals: { name: undefined }}});
  });

  it('should set the specified property.', function () {
    set({a: 'aaa', b: 'b'}, 'a', 'bbb').should.eql({a: 'bbb', b: 'b'});
  });

  it('should support passing an array as the key', function () {
    var actual = set({a: 'a', b: {c: 'd'}}, ['b', 'c', 'd'], 'eee');
    actual.should.eql({a: 'a', b: {c: {d: 'eee'}}});
  });

  it('should set a deeply nested value.', function () {
    var actual = set({a: 'a', b: {c: 'd'}}, 'b.c.d', 'eee');
    actual.should.eql({a: 'a', b: {c: {d: 'eee'}}});
  });

  it('should return the entire object if no property is passed.', function () {
    set({a: 'a', b: {c: 'd'}}).should.eql({a: 'a', b: {c: 'd'}});
  });

  it('should set a value only.', function () {
    set({a: 'a', b: {c: 'd'}}, 'b.c').should.eql({a: 'a', b: {c: undefined}});
  });

  it('should set non-plain objects', function (done) {
    var o = {};

    set(o, 'a.b', new Date());
    var firstDate = o.a.b.getTime();

    setTimeout(function () {
      set(o, 'a.b', new Date());
      var secondDate = o.a.b.getTime();

      firstDate.should.not.eql(secondDate);
      done();
    }, 10);
  });
});

describe('escaping', function () {
  it('should recognize escaped dots:', function() {
    var o = {};
    set(o, 'a\\.b.c.d.e', 'c');
    o['a.b'].c.d.e.should.equal('c');
  });

  it('should work with multple escaped dots:', function() {
    var o = {};
    set(o, 'e\\.f\\.g', 1);
    o['e.f.g'].should.equal(1);
  });

  it('should work with multple escaped dots:', function() {
    var o = {};
    set(o, 'e\\.f.g\\.h\\.i.j', 1);
    o.should.eql({ 'e.f': { 'g.h.i': { j: 1 } } });
  });
});
