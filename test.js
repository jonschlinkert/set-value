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
  it('should use property paths to set nested values from the source object.', function () {
    var fixture = {
      a: {locals : {name: {first: 'Brian'}}},
      b: {locals : {name: {last: 'Woodward'}}}
    };
    set(fixture, 'a.locals.name').should.eql({first: 'Brian'});
    set(fixture, 'b.locals.name').should.eql({last: 'Woodward'});
    set(fixture, 'b.locals.name.last').should.eql('Woodward');
  });

  it('should return an empty object if the path is not found', function () {
    var fixture = {};
    set(fixture, 'a.locals.name').should.eql({});
    set(fixture, 'b.locals.name').should.eql({});
  });

  it('should set the specified property.', function () {
    set({a: 'aaa', b: 'b'}, 'a').should.eql('aaa');
    set({first: 'Jon', last: 'Schlinkert'}, 'first').should.eql('Jon');
    set({locals: {a: 'a'}, options: {b: 'b'}}, 'locals').should.eql({a: 'a'});
  });

  it('should set a value only.', function () {
    set({a: 'a', b: {c: 'd'}}, 'a').should.eql('a');
  });

  it('should return the entire object if no property is passed.', function () {
    set({a: 'a', b: {c: 'd'}}).should.eql({a: 'a', b: {c: 'd'}});
  });

  it('should set a value only.', function () {
    set({a: 'a', b: {c: 'd'}}, 'b.c').should.eql('d');
  });

  it('should set the value of a deeply nested property.', function () {
    set({a: {b: 'c', c: {d: 'e', e: 'f', g: {h: 'i'}}}}, 'a.c.g.h').should.eql('i');
  });

  it('should return an empty object if the first value is null.', function () {
    set(null, 'a.c.g.h').should.eql({});
  });
});

describe('set', function() {
  var obj = {};

  it('should return immediate property value.', function () {
    set(obj, 'a', 1).should.equal(1);
  });
  it('should set property value.', function () {
    obj.a.should.equal(1);
  });
  it('should return nested property value.', function () {
    set(obj, 'b.c.d', 1).should.equal(1);
  });
  it('should set property value.', function () {
    obj.b.c.d.should.equal(1);
  });
  it('should literal backslash should escape period in property name.', function () {
    set(obj, 'e\\.f\\.g', 1);
    console.log(obj)
    obj.should.equal(1);
    obj['e.f.g'].should.equal(1);
  });
});
