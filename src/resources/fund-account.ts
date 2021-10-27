import { FetchAllResponse, FetchAllQueryParams } from '../types/types';
import AxiosClient from '../utils/axios-client';
import { normalizeDate } from '../utils/utils';

export interface CreateFundAccountParams {
  contact_id: string;
  account_type: AccountType;
  vpa?: Vpa;
  bank_account?: BankAccount;
  card?: Card;
  wallet?: Wallet;
}

export enum AccountType {
  vpa = 'vpa',
  bankAccount = 'bank_account',
  card = 'card',
  wallet = 'wallet',
}
export interface Vpa {
  address: string;
}
export interface Card {
  name: string;
  number: string;
}
export interface BankAccount {
  name: string;
  ifsc: string;
  account_number: string;
}
export interface Wallet {
  provider: 'amazonpay';
  phone: string;
  email?: string;
  name?: string;
}

export interface FundAccount {
  id: string;
  entity: string;
  contact_id: string;
  account_type: AccountType;
  active: boolean;
  batch_id: string;
  created_at: number;
  vpa?: Vpa;
  bank_account?: BankAccount;
  card?: Card;
}

export interface FetchAllFundAccountParms extends FetchAllQueryParams {
  account_type?: AccountType;
  contact_id?: string;
}

export default function fundAccount(axiosClient: AxiosClient) {
  const BASE_URL = '/fund_accounts';
  return {
    /**
     * Create a fund account of type bank_account
     *
     * * A new fund account is created if any combination of the following details is unique: contact_id,
     * bank_account.name, bank_account.ifsc and bank_account.account_number.
     *
     * * If all the above details match the details of an existing fund account, the API returns details of the existing fund account.
     *
     * * You cannot edit the details of a fund account.
     * https://razorpay.com/docs/razorpayx/api/fund-accounts/#create-a-fund-account
     */
    async create(params: CreateFundAccountParams) {
      switch (params.account_type) {
        case AccountType.vpa:
          if (!params.vpa) {
            throw new Error('`vpa` is missing');
          }
          break;
        case AccountType.card:
          if (!params.card) {
            throw new Error('`card` is missing');
          }
          break;
        case AccountType.bankAccount:
          if (!params.bank_account) {
            throw new Error('`bank_account` is missing');
          }
          break;
        case AccountType.wallet:
          if (!params.wallet) {
            throw new Error('`wallet` is missing');
          }
          break;
        default:
          break;
      }
      let url = BASE_URL;
      return axiosClient.post<FundAccount>({ url, data: params });
    },
    /**
     * Activate or deactivate a fund account. This helps you block payouts to certain fund account, as and when required.
     *
     * https://razorpay.com/docs/razorpayx/api/fund-accounts/#activate-or-deactivate-a-fund-account
     *
     * @param fundAccountId The unique identifier linked to the fund account. For example, `fa_00000000000001`
     * @param active The state to which you want to move the fund account.
     * Possible values:
     *
     * `true` (default) = active
     *
     * `false` = inactive
     *
     * Pass false to deactivate an account and pass true to activate an account
     * @returns
     */
    async toggleActiveFundAccount(fundAccountId: string, active: boolean) {
      if (!fundAccountId) {
        throw new Error('`fundAccountId` is missing');
      }
      if (active == undefined) {
        throw new Error('`active` is missing');
      }
      let url = `${BASE_URL}/${fundAccountId}`;
      return axiosClient.patch<FundAccount>({ url, data: { active } });
    },
    /**
     * Fetch details of all available fund accounts in the system.
     *
     * https://razorpay.com/docs/razorpayx/api/fund-accounts/#fetch-all-fund-accounts
     * @param params query paramaters {@link FetchContactQueryParams}
     * @returns
     */
    async fetchAll(params: FetchAllFundAccountParms) {
      let { from, to, count, skip } = params,
        url = BASE_URL;
      if (count && count > 100) {
        throw new Error('`count` can be maximum of 100');
      }
      if (from) {
        from = normalizeDate(from);
      }

      if (to) {
        to = normalizeDate(to);
      }
      count = Number(count) || 10;
      skip = Number(skip) || 0;
      return axiosClient.get<FetchAllResponse<FundAccount>>({ url, data: { ...params, from, to, count, skip } });
    },
    /**
     * Fetch details of required fund account.
     *
     * https://razorpay.com/docs/razorpayx/api/fund-accounts/#fetch-fund-account-details-by-id
     * @param fundAccountId The unique identifier linked to the fund account. For example, `fa_00000000000001`
     * @returns The Specific Contact {@link Contact}
     */
    async fetch(fundAccountId: string) {
      if (!fundAccountId) {
        throw new Error('`fundAccountId` is missing');
      }
      let url = `${BASE_URL}/${fundAccountId}`;
      return axiosClient.get<FundAccount>({ url });
    },
  };
}
