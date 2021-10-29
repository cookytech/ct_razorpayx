import { assert } from 'chai';
import mock, { MockResponse } from './utils/mocker';
import razorpayx from './utils/razorpayx';
import equal from 'deep-equal';
import { FetchContactQueryParams } from '../src/resources/contacts';
import { getDateInSecs } from '../src/utils/utils';
import { CreatePayoutParams, FetchAllPayoutParams, PayoutPurposetype } from '../src/resources/payout';
import { CreatePayoutLinkParams, FetchAllPayoutLinkParams } from '../src/resources/payout-link';

describe('Payout Link', () => {
  it('Create Payout Link', async () => {
    const params: CreatePayoutLinkParams = {
      account_number: '1234',
      amount: 1000,
      currency: 'INR',
      purpose: PayoutPurposetype.cashback,
      receipt: '1234',
      contact: {
        id: '1234',
      },
    };

    const expectedParams: CreatePayoutLinkParams = {
      ...params,
    };
    mock({
      url: '/payout-links',
      method: 'POST',
    });

    const response = await razorpayx.payoutLink.create(params);
    const data = response as any as MockResponse;
    assert.equal(data.__JUST_FOR_TESTS__.url, '/v1/payout-links', 'Create Payout request url formed');
    assert.ok(equal(data.__JUST_FOR_TESTS__.requestBody, expectedParams), 'All params are passed in request body');
  });
  it('Cancel a Payout Link', async () => {
    const payoutLinkId = 'poutlk_1234';

    mock({
      url: `/payout-links/${payoutLinkId}/cancel`,
      method: 'POST',
    });

    const response = await razorpayx.payoutLink.cancelPayoutLink(payoutLinkId);
    const data = response as any as MockResponse;
    assert.equal(
      data.__JUST_FOR_TESTS__.url,
      `/v1/payout-links/${payoutLinkId}/cancel`,
      'Cancel payout link request url formed',
    );
  });
  it('Fetch All Payout links', async () => {
    const fromDate = new Date();
    fromDate.setFullYear(2002);
    const toDate = new Date();
    toDate.setFullYear(2003);
    const fromDateInSec = getDateInSecs(fromDate);
    const toDateInSec = getDateInSecs(toDate);
    const contactId = 'cont_1234';
    const params: FetchAllPayoutLinkParams = {
      contact_id: contactId,
      from: fromDate,
      to: toDateInSec,
      count: 20,
      skip: 1,
    };

    const expectedParams = {
      contact_id: contactId,
      from: fromDateInSec,
      to: toDateInSec,
      count: 20,
      skip: 1,
    };

    mock({
      url: `/payout-links`,
      method: 'GET',
    });
    const response = await razorpayx.payoutLink.fetchAll(params);
    const data = response as any as MockResponse;
    const expectedUrl = `/v1/payout-links?contact_id=${contactId}&from=${fromDateInSec}&to=${toDateInSec}&count=${params.count}&skip=${params.skip}`;
    assert.equal(data.__JUST_FOR_TESTS__.url, expectedUrl, 'Fetch All Payout Links request url formed');
    assert.ok(
      equal(data.__JUST_FOR_TESTS__.requestQueryParams, expectedParams),
      'All params are passed in request body',
    );
  });
  it('Fetch a Payout Link', async () => {
    const payoutLinkId = 'poutlk_1234';
    mock({
      url: `/payout-links/${payoutLinkId}`,
      method: 'GET',
    });

    const response = await razorpayx.payoutLink.fetch(payoutLinkId);
    const data = response as any as MockResponse;
    assert.equal(
      data.__JUST_FOR_TESTS__.url,
      `/v1/payout-links/${payoutLinkId}`,
      'Fetch a payout Link request url formed',
    );
  });
});
