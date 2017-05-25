import chai, { assert } from 'chai';

import { foldEither } from 'xod-func-tools';
import transpile from '../src/transpiler';

import blinkProject from './fixtures/blink.project.json';
import blinkCpp from './fixtures/blink.cpp';

import potLedProject from './fixtures/pot-led.project.json';
import potLedCpp from './fixtures/pot-led.cpp';

describe('xod-arduino transpiler (end-to-end tests)', () => {
  it('Transpile Blink project with "@/main" entry-point patch should return Either.Right with C++ code', () => {
    foldEither(
      (err) => { throw err; },
      cpp => assert.strictEqual(cpp, blinkCpp, 'expected and actual C++ don’t match'),
      transpile(blinkProject, '@/main')
    );
  });
  it.skip('Transpile PotLed project with "@/main" entry-point patch should return Either.Right with C++ code', () => {
    foldEither(
      (err) => { throw err; },
      cpp => assert.strictEqual(cpp, potLedCpp, 'expected and actual C++ don’t match'),
      transpile(potLedProject, '@/main')
    );
  });
  it('Transpile Blink project with non-existing-patch as entry-point should return Either.Left with error if entry-point patch not found', () => {
    const r = transpile(blinkProject, '@/non-existing-patch');
    assert.equal(r.isLeft, true);
  });
});
