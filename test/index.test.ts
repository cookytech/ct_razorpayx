import { Greeter } from '../src/index';
import { assert } from 'chai';
//   assert(Greeter('Biswa'), 'Hello Biswa');
context('Demo Test', () => {
  it('test', () => {
    assert.equal(Greeter('Biswa'), 'Hello Biswa');
  });
});
