import { assert } from 'chai';
import mock, { MockResponse } from './utils/mocker';
import razorpayx from './utils/razorpayx';
import equal from 'deep-equal';
import { FetchContactQueryParams } from '../src/resources/contacts';
import { getDateInSecs } from '../src/utils/utils';
import { CreatePayoutParams, FetchAllPayoutParams, PayoutPurposetype } from '../src/resources/payout';

describe('Payout', () => {
  it('Create Payout', async () => {
    let params: CreatePayoutParams = {
      account_number: '1234',
      fund_account_id: 'fa_1234',
      amount: 1000,
      currency: 'INR',
      mode: 'IMPS',
      purpose: PayoutPurposetype.cashback,
    };

    let expectedParams: CreatePayoutParams = {
      ...params,
    };
    mock({
      url: '/payouts',
      method: 'POST',
    });

    const response = await razorpayx.payout.create(params);
    const data = response?.data as any as MockResponse;
    assert.equal(data.__JUST_FOR_TESTS__.url, '/v1/payouts', 'Create Payout request url formed');
    assert.ok(equal(data.__JUST_FOR_TESTS__.requestBody, expectedParams), 'All params are passed in request body');
  });
  it('Cancel a Queued Payout', async () => {
    const payoutId = 'pout_1234';

    mock({
      url: `/payouts/${payoutId}/cancel`,
      method: 'POST',
    });

    const response = await razorpayx.payout.cancelQueuedPayout(payoutId);
    const data = response?.data as any as MockResponse;
    assert.equal(
      data.__JUST_FOR_TESTS__.url,
      `/v1/payouts/${payoutId}/cancel`,
      'Cancel queued payout request url formed',
    );
  });
  it('Fetch All Payouts', async () => {
    const fromDate = new Date();
    fromDate.setFullYear(2002);
    const toDate = new Date();
    toDate.setFullYear(2003);
    const fromDateInSec = getDateInSecs(fromDate);
    const toDateInSec = getDateInSecs(toDate);

    let params: FetchAllPayoutParams = {
      reference_id: '1234',
      from: fromDate,
      to: toDateInSec,
      count: 20,
      skip: 1,
    };
    const accountNumber = '1234';
    let expectedParams = {
      account_number: accountNumber,
      reference_id: '1234',
      from: fromDateInSec,
      to: toDateInSec,
      count: 20,
      skip: 1,
    };

    mock({
      url: `/payouts`,
      method: 'GET',
    });
    const response = await razorpayx.payout.fetchAll(accountNumber, params);
    const data = response?.data as any as MockResponse;
    const expectedUrl = `/v1/payouts?account_number=${accountNumber}&reference_id=${params.reference_id}&from=${fromDateInSec}&to=${toDateInSec}&count=${params.count}&skip=${params.skip}`;
    assert.equal(data.__JUST_FOR_TESTS__.url, expectedUrl, 'Fetch All Payouts request url formed');
    assert.ok(
      equal(data.__JUST_FOR_TESTS__.requestQueryParams, expectedParams),
      'All params are passed in request body',
    );
  });
  it('Fetch a Payout', async () => {
    const payoutId = 'pout_1234';
    mock({
      url: `/payouts/${payoutId}`,
      method: 'GET',
    });

    const response = await razorpayx.payout.fetch(payoutId);
    const data = response?.data as any as MockResponse;
    assert.equal(data.__JUST_FOR_TESTS__.url, `/v1/payouts/${payoutId}`, 'Fetch a payout request url formed');
  });
});
