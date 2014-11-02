/*!
 * set-object <https://github.com/jonschlinkert/set-object>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var should = require('should');
var set = require('./');

describe('set', function() {
  it('should create a nested property if it does not already exist:', function() {
    var o = {};
    set(o, 'a.b', 'c');
    o.a.b.should.equal('c');
  });

  it('should not create a nested property if it does already exist:', function() {
    var first = {name: 'Halle'};
    var o = {a: first };
    set(o, 'a.b', 'c');
    o.a.b.should.equal('c');
    o.a.should.equal(first);
    o.a.name.should.equal('Halle');
  });

  it('shold support immediate properties:', function() {
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

  it('should set a value only.', function () {
    set({a: 'a', b: {c: 'd'}}, 'b.c.d', 'eee').should.eql({a: 'a', b: {c: {d: 'eee'}}});
  });

  it('should return the entire object if no property is passed.', function () {
    set({a: 'a', b: {c: 'd'}}).should.eql({a: 'a', b: {c: 'd'}});
  });

  it('should set a value only.', function () {
    set({a: 'a', b: {c: 'd'}}, 'b.c').should.eql({a: 'a', b: {c: undefined}});
  });
});
