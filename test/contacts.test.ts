'use strict';

import { assert } from 'chai';
import mock, { MockResponse } from './mocker';
import razorpayx from './razorpayx';
import equal from 'deep-equal';

describe('CONTACTS', () => {
  it('Create Contact', async () => {
    let params = {
      name: 'test',
      email: 'test@razorpay.com',
      contact: '123456789',
      notes: {
        note1: 'This is note1',
        note2: 'This is note2',
      },
    };

    let expectedParams = {
      name: 'test',
      email: 'test@razorpay.com',
      contact: '123456789',
      notes: {
        note1: 'This is note1',
        note2: 'This is note2',
      },
    };

    mock({
      url: '/contacts',
      method: 'POST',
    });

    const response = await razorpayx.contacts.create(params);
    const data = response.data as MockResponse;
    assert.equal(data.__JUST_FOR_TESTS__.url, '/v1/contacts', 'Create Contact request url formed');
    assert.ok(equal(data.__JUST_FOR_TESTS__.requestBody, expectedParams), 'All params are passed in request body');
  });
});
