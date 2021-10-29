import { FetchAllResponse, FetchAllQueryParams } from '../types/types';
import AxiosClient from '../utils/axios-client';
import RazorpayxError from '../utils/razorpayx_error';
import { normalizeDate } from '../utils/utils';

export interface CreateFundAccountParams {
  /**
   * This is the unique identifier linked to a contact. For example, `cont_00000000000001`.
   */
  contact_id: string;
  /**
   * The account type you want to link to the contact ID. For example, `bank_account`.
   */
  account_type: AccountType;
  /**
   * The contact's virtual payment address (VPA) details.
   */
  vpa?: Vpa;
  /**
   * The contact's bank account details.
   */
  bank_account?: BankAccount;
  /**
   * The contact's card details.
   */
  card?: Card;
  /**
   * The contact's card details.
   */
  wallet?: Wallet;
}

export enum AccountType {
  vpa = 'vpa',
  bankAccount = 'bank_account',
  card = 'card',
  wallet = 'wallet',
}
export interface Vpa {
  /**
   * Between 3 and 100 characters. Supported characters: `a-z`, `A-Z`, `0-9`, `.`, `-` and one `@`.
   *  The virtual payment address. For example, `gauravkumar@exampleupi`.
   */
  address: string;
}
export interface Card {
  /**
   * Card Name
   */
  name: string;
  /**
   * Card Number
   */
  number: string;
}
export interface BankAccount {
  /**
   * Account holder's name. Name must be between 4 - 120 characters. This field is case-sensitive.
   *  Name cannot end with a special character, except `.`. Supported characters:
   *  `a-z`, `A-Z`, `0-9`, `space`,` ’` , `-` , `_ `, `/` , `( `,` )` and , `.`. For example, `Gaurav Kumar`.
   */
  name: string;
  /**
   * Beneficiary bank IFSC. Has to be 11 characters. Unique identifier of a bank branch. For example, `HDFC0000053`.
   */
  ifsc: string;
  /**
   * Beneficiary account number. Between 5 and 35 characters. Supported characters: `a-z`, `A-Z` and `0-9`. Beneficiary account number. For example, `765432123456789`.
   */
  account_number: string;
}
export interface Wallet {
  provider: 'amazonpay';
  phone: string;
  email?: string;
  name?: string;
}

export interface FundAccount {
  /**
   * The unique identifier linked to the fund account. For example, `fa_00000000000001`.
   */
  id: string;
  /**
   *  Here it will be `fund_account`.
   */
  entity: string;
  /**
   * The unique identifier linked to the contact. For example, `cont_00000000000001`.
   */
  contact_id: string;
  /**
   * The fund account type being created.
   */
  account_type: AccountType;
  /**
   * Possible values:
   * * true: active
   * * false: inactive
   */
  active: boolean;
  /**
   * This parameter is populated if the fund account was created as part of a bulk upload. For example, `batch_00000000000001`.
   */
  batch_id: string;
  /**
   * Timestamp, in Unix, when the fund account was created. For example, 1545320320.
   */
  created_at: number;
  /**
   * The contact's virtual payment address (VPA) details.
   */
  vpa?: Vpa;
  /**
   * The contact's bank account details.
   */
  bank_account?: BankAccount;
  /**
   * The contact's card.
   */
  card?: Card;
}

export interface FetchAllFundAccountParms extends FetchAllQueryParams {
  /**
   * The fund account type to be fetched. Possible values:
   * * bank_account
   * * vpa
   * * card (if payouts to cards is enabled on your account)
   */
  account_type?: AccountType;
  /**
   * The unique contact ID for which fund accounts are to be fetched. For example, `cont_00000000000001`.
   */
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
            throw new RazorpayxError('`vpa` is missing');
          }
          break;
        case AccountType.card:
          if (!params.card) {
            throw new RazorpayxError('`card` is missing');
          }
          break;
        case AccountType.bankAccount:
          if (!params.bank_account) {
            throw new RazorpayxError('`bank_account` is missing');
          }
          break;
        case AccountType.wallet:
          if (!params.wallet) {
            throw new RazorpayxError('`wallet` is missing');
          }
          break;
        default:
          break;
      }
      const url = BASE_URL;
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
        throw new RazorpayxError('`fundAccountId` is missing');
      }
      if (active === undefined) {
        throw new RazorpayxError('`active` is missing');
      }
      const url = `${BASE_URL}/${fundAccountId}`;
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
      let { from, to, count, skip } = params;
      const url = BASE_URL;
      if (count && count > 100) {
        throw new RazorpayxError('`count` can be maximum of 100');
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
        throw new RazorpayxError('`fundAccountId` is missing');
      }
      const url = `${BASE_URL}/${fundAccountId}`;
      return axiosClient.get<FundAccount>({ url });
    },
  };
}
