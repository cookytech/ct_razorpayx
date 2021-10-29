import { AxiosResponse } from 'axios';
import { assert } from 'chai';
import equal from 'deep-equal';
import { CreateContactParams, FetchContactQueryParams, UpdateContactParams } from '../src/resources/contacts';
import { getDateInSecs } from '../src/utils/utils';
import mock, { MockResponse } from './utils/mocker';
import razorpayx from './utils/razorpayx';

describe('Contacts', () => {
  it('Create Contact', async () => {
    const params: CreateContactParams = {
      name: 'test',
      email: 'test@razorpay.com',
      contact: '123456789',
      notes: {
        note1: 'This is note1',
        note2: 'This is note2',
      },
    };

    const expectedParams: CreateContactParams = {
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
    const data = response as any as MockResponse;
    assert.equal(data.__JUST_FOR_TESTS__.url, '/v1/contacts', 'Create Contact request url formed');
    assert.ok(equal(data.__JUST_FOR_TESTS__.requestBody, expectedParams), 'All params are passed in request body');
  });
  it('Update Contact', async () => {
    const params: UpdateContactParams = {
      name: 'test',
      email: 'test@razorpay.com',
      contact: '123456789',
      notes: {
        note1: 'This is note1',
        note2: 'This is note2',
      },
    };

    const expectedParams: UpdateContactParams = {
      name: 'test',
      email: 'test@razorpay.com',
      contact: '123456789',
      notes: {
        note1: 'This is note1',
        note2: 'This is note2',
      },
    };
    const contactId = 'cont_1234';

    mock({
      url: `/contacts/${contactId}`,
      method: 'PATCH',
    });

    const response = await razorpayx.contacts.update(contactId, params);
    const data = response as any as MockResponse;
    assert.equal(data.__JUST_FOR_TESTS__.url, `/v1/contacts/${contactId}`, 'Update Contact request url formed');
    assert.ok(equal(data.__JUST_FOR_TESTS__.requestBody, expectedParams), 'All params are passed in request body');
  });
  it('Toggle Active Contact', async () => {
    const active = false;
    const expectedParams = {
      active,
    };

    mock({
      url: '/contacts/1',
      method: 'PATCH',
    });

    const response = await razorpayx.contacts.toggleActiveContact('1', active);
    const data = response as any as MockResponse;
    assert.equal(data.__JUST_FOR_TESTS__.url, '/v1/contacts/1', 'Toggle Active Contact request url formed');
    assert.ok(equal(data.__JUST_FOR_TESTS__.requestBody, expectedParams), 'All params are passed in request body');
  });
  it('Fetch All Contacts', async () => {
    const fromDate = new Date();
    fromDate.setFullYear(2002);
    const toDate = new Date();
    toDate.setFullYear(2003);
    const fromDateInSec = getDateInSecs(fromDate);
    const toDateInSec = getDateInSecs(toDate);

    const params: FetchContactQueryParams = {
      name: 'test',

      from: fromDate,
      to: toDateInSec,
      count: 20,
      skip: 1,
    };

    const expectedParams: FetchContactQueryParams = {
      name: 'test',
      from: fromDateInSec,
      to: toDateInSec,
      count: 20,
      skip: 1,
    };
    mock({
      url: '/contacts',
      method: 'GET',
    });
    const response = await razorpayx.contacts.fetchAll(params);
    const data = response as any as MockResponse;
    const expectedUrl = `/v1/contacts?name=${params.name}&from=${fromDateInSec}&to=${toDateInSec}&count=${params.count}&skip=${params.skip}`;
    assert.equal(data.__JUST_FOR_TESTS__.url, expectedUrl, 'Fetch All Contacts request url formed');
    assert.ok(
      equal(data.__JUST_FOR_TESTS__.requestQueryParams, expectedParams),
      'All params are passed in request body',
    );
  });
  it('Fetch a Contact', async () => {
    const contactId = 'cont_1234';
    mock({
      url: `/contacts/${contactId}`,
      method: 'GET',
    });

    const response = await razorpayx.contacts.fetch(contactId);
    const data = response as any as MockResponse;
    assert.equal(data.__JUST_FOR_TESTS__.url, `/v1/contacts/${contactId}`, 'Fetch a Contact request url formed');
  });
});
