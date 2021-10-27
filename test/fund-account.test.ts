import { assert } from 'chai';
import equal from 'deep-equal';
import { AccountType, CreateFundAccountParams, FetchAllFundAccountParms } from '../src/resources/fund-account';
import { getDateInSecs } from '../src/utils/utils';
import mock, { MockResponse } from './utils/mocker';
import razorpayx from './utils/razorpayx';

describe('Fund Account', () => {
  it('Create fund Account', async () => {
    let params: CreateFundAccountParams = {
      account_type: AccountType.vpa,
      contact_id: '1',
      vpa: { address: 'vpaaddress' },
    };

    let expectedParams: CreateFundAccountParams = {
      account_type: AccountType.vpa,
      contact_id: '1',
      vpa: { address: 'vpaaddress' },
    };
    mock({
      url: '/fund_accounts',
      method: 'POST',
    });

    const response = await razorpayx.fundAccount.create(params);
    const data = response?.data as any as MockResponse;
    assert.equal(data.__JUST_FOR_TESTS__.url, '/v1/fund_accounts', 'Create Fund Account request url formed');
    assert.ok(equal(data.__JUST_FOR_TESTS__.requestBody, expectedParams), 'All params are passed in request body');
  });
  it('Toggle Fund Account', async () => {
    const active = false;
    const fundAccountId = 'fa_1234';
    let expectedParams = {
      active,
    };

    mock({
      url: `/fund_accounts/${fundAccountId}`,
      method: 'PATCH',
    });

    const response = await razorpayx.fundAccount.toggleActiveFundAccount(fundAccountId, active);
    const data = response?.data as any as MockResponse;
    assert.equal(
      data.__JUST_FOR_TESTS__.url,
      `/v1/fund_accounts/${fundAccountId}`,
      'Toggle Active Fund Account request url formed',
    );
    assert.ok(equal(data.__JUST_FOR_TESTS__.requestBody, expectedParams), 'All params are passed in request body');
  });
  it('Fetch All Fund Accounts', async () => {
    const fromDate = new Date();
    fromDate.setFullYear(2002);
    const toDate = new Date();
    toDate.setFullYear(2003);
    const fromDateInSec = getDateInSecs(fromDate);
    const toDateInSec = getDateInSecs(toDate);
    const contactId = 'cont_1234';
    let params: FetchAllFundAccountParms = {
      contact_id: contactId,
      from: fromDate,
      to: toDateInSec,
      count: 20,
      skip: 1,
    };

    let expectedParams: FetchAllFundAccountParms = {
      contact_id: contactId,
      from: fromDateInSec,
      to: toDateInSec,
      count: 20,
      skip: 1,
    };
    mock({
      url: '/fund_accounts',
      method: 'GET',
    });
    const response = await razorpayx.fundAccount.fetchAll(params);
    const data = response?.data as any as MockResponse;
    const expectedUrl = `/v1/fund_accounts?contact_id=${params.contact_id}&from=${fromDateInSec}&to=${toDateInSec}&count=${params.count}&skip=${params.skip}`;
    assert.equal(data.__JUST_FOR_TESTS__.url, expectedUrl, 'Fetch All Fund Accounts request url formed');
    assert.ok(
      equal(data.__JUST_FOR_TESTS__.requestQueryParams, expectedParams),
      'All params are passed in request body',
    );
  });
  it('Fetch a Fund Account', async () => {
    const fundAccountId = 'fa_1234';
    mock({
      url: `/fund_accounts/${fundAccountId}`,
      method: 'GET',
    });

    const response = await razorpayx.fundAccount.fetch(fundAccountId);
    const data = response?.data as any as MockResponse;
    assert.equal(
      data.__JUST_FOR_TESTS__.url,
      `/v1/fund_accounts/${fundAccountId}`,
      'Fetch a Fund Account request url formed',
    );
  });
});
