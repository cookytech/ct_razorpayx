import { assert } from 'chai';
import equal from 'deep-equal';
import { FetchContactQueryParams } from '../src/resources/contacts';
import { FetchAllQueryParams } from '../src/types/types';
import { getDateInSecs } from '../src/utils/utils';
import mock, { MockResponse } from './utils/mocker';
import razorpayx from './utils/razorpayx';

describe('Transaction', () => {
  it('Fetch All transaction', async () => {
    const fromDate = new Date();
    fromDate.setFullYear(2002);
    const toDate = new Date();
    toDate.setFullYear(2003);
    const fromDateInSec = getDateInSecs(fromDate);
    const toDateInSec = getDateInSecs(toDate);

    const accountNumber = '1234';
    let params: FetchAllQueryParams = {
      from: fromDate,
      to: toDateInSec,
      count: 20,
      skip: 1,
    };

    let expectedParams = {
      account_number: accountNumber,
      from: fromDateInSec,
      to: toDateInSec,
      count: 20,
      skip: 1,
    };
    mock({
      url: '/transactions',
      method: 'GET',
    });
    const response = await razorpayx.transaction.fetchAll(accountNumber, params);
    const data = response.data as any as MockResponse;
    const expectedUrl = `/v1/transactions?account_number=${accountNumber}&from=${fromDateInSec}&to=${toDateInSec}&count=${params.count}&skip=${params.skip}`;
    assert.equal(data.__JUST_FOR_TESTS__.url, expectedUrl, 'Fetch All Transaction request url formed');
    assert.ok(
      equal(data.__JUST_FOR_TESTS__.requestQueryParams, expectedParams),
      'All params are passed in request body',
    );
  });
  it('Fetch a transaction', async () => {
    const transactionId = 'txn_1234';
    mock({
      url: `/transactions/${transactionId}`,
      method: 'GET',
    });

    const response = await razorpayx.transaction.fetch(transactionId);
    const data = response.data as any as MockResponse;
    assert.equal(
      data.__JUST_FOR_TESTS__.url,
      `/v1/transactions/${transactionId}`,
      'Fetch a Transaction request url formed',
    );
  });
});
