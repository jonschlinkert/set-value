'use strict';

const assert = require('assert').strict;
const Rx = require('rxjs');
const operators = require('rxjs/operators');
const set = require('..');

let _value = 0;
let received = [];
const o = { a: { b: {} } };
const obs = Rx.from(new Rx.BehaviorSubject()).pipe(operators.skip(1));
const noop = () => {};

Object.defineProperty(o.a.b, 'c', {
  configurable: true,
  get() { return _value; },
  set(value) {
    _value = value;
    obs.next(value);
  }
});

describe('Setter with Observable', () => {
  it('should only assign/emit once for each call of set', cb => {
    const subs = obs.subscribe(data => { received.push(data); }, noop, () => {
      assert.equal(received.length, 1);
      cb();
    });
    set(o, 'a.b.c', 5);
    subs.complete();
  });

  it('should work assignment via setter', cb => {
    received = null;
    const subs = obs.subscribe(data => { received = data; }, noop, () => {
      assert.equal(received, 10);
      cb();
    });
    set(o, 'a.b.c', 10);
    subs.complete();
  });

  it('should work with merge of object via setter', cb => {
    received = null;
    set(o, 'a.b.c', { foo: 'bar' });
    const subs = obs.subscribe(data => { received = data; }, noop, () => {
      assert.deepEqual(o.a.b.c, { foo: 'bar', bing: 'bong' });
      cb();
    });
    set(o, 'a.b.c', { bing: 'bong' }, { merge: true });
    subs.complete();
  });
});
