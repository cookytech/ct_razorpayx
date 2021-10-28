'use strict';

import { assert } from 'chai';

import { normalizeDate, getDateInSecs, isDefined, validateWebhookSignature } from '../src/utils/utils';

describe('Razorpayx Utils', () => {
  it('normalizeDate', () => {
    const stringDate: string = 'Oct 28, 2021';
    assert.equal(normalizeDate(stringDate), getDateInSecs(stringDate), 'Returns date in secs when String date passed');
    const numberDate: number = 1472252800;
    assert.equal(normalizeDate(numberDate), numberDate, 'Returns date in secs when seconds in number passed');
    const objectDate: Date = new Date();
    assert.equal(normalizeDate(objectDate), getDateInSecs(objectDate), 'Returns date in secs when date object passed');
  });

  it('isDefined', () => {
    assert.ok(!isDefined(undefined) && isDefined(''), 'Checks if the argument is defined');
  });

  it('validateWebhookSignature', () => {
    const respBody = '{"a":1,"b":2,"c":{"d":3}}';
    const secret = '123456';
    const correctSignature = '2fe04e22977002e6c7cb553adab8b460cb' + '9e2a4970d5953cb27a8472752e3bbc';
    const wrongSignature = 'sdfafds';

    assert.ok(
      validateWebhookSignature(respBody, correctSignature, secret) &&
        !validateWebhookSignature(respBody, wrongSignature, secret),
      'Validates webhook signature',
    );
  });
});
