import {
  CurrencyType,
  FetchAllResponse,
  FetchAllQueryParams,
  Notes,
  TransactionMode,
  TransactionStatus,
} from '../types/types';
import AxiosClient from '../utils/axios-client';
import RazorpayxError from '../utils/razorpayx_error';
import { normalizeDate } from '../utils/utils';

export enum PayoutPurposetype {
  refund = 'refund',
  cashback = 'cashback',
  payout = 'payout',
  salary = 'salary',
  utilityBill = 'utility bill',
  vendorBill = 'vendor bill',
}

type FetchAllPayoutMode = 'NEFT' | 'RTGS' | 'IMPS' | 'UPI' | 'amazonpay';
export interface CreatePayoutParams {
  /**
   * The account from which you want to make the payout.
   * Account details can be found on the RazorpayX Dashboard. For example, `7878780080316316`.
   * * Pass your virtual account number if you want money to be deducted from your virtual account.
   * * Pass your current account number if you want money to be deducted from your current account.
   *
   * Watch Out!
   * This is NOT your contact's bank account number.
   */
  account_number: string;
  /**
   * The unique identifier linked to a fund account. For example, `fa_00000000000001`.
   */
  fund_account_id: string;
  /**
   * The payout amount, in paise. For example, if you want to transfer ₹10,000, pass `1000000`. Minimum value `100`.
   */
  amount: number;
  /**
   * The payout currency. Here, it is `INR`.
   */
  currency: CurrencyType;
  /**
   * The mode to be used to create the payout. Available modes:
   * * NEFT
   * * RTGS
   * * IMPS
   */
  mode: TransactionMode;
  /**
   * The purpose of the payout that is being created.
   */
  purpose: PayoutPurposetype;
  /**
   * Possible values:
   * * true - The payout is queued when your business account does not have sufficient balance to process the payout.
   * * false (default) - The payout is never queued. The payout fails if your business account does not have sufficient balance to process the payout.
   */
  queue_if_low_balance?: boolean;
  /**
   * Maximum length 40 characters. A user-generated reference given to the payout.
   * For example, `Acme Transaction ID 12345`. You can use this field to store your own transaction ID, if any.
   */
  reference_id?: string;
  /**
   * Maximum length 30 characters. Allowed characters: a-z, A-Z, 0-9 and space.
   * This is a custom note that also appears on the bank statement.
   *
   * Handy Tips
   * * If no value is passed for this parameter, it defaults to the Merchant Billing Label.
   * * Ensure that the most important text forms the first 9 characters as banks may truncate the rest as per their standards.
   */
  narration?: string;
  /**
   * Key-value pair that can be used to store additional information about the entity.
   *  Maximum 15 key-value pairs, 256 characters (maximum) each. For example, `"note_key": "Beam me up Scotty”`.
   */
  notes?: Notes;
}

export interface Payout {
  /**
   * The unique identifier linked to the payout. For example, `pout_00000000000001`.
   */
  id: string;
  /**
   *  The entity being created. Here, it will be `payout`.
   */
  entity: string;
  /**
   * The unique identifier linked to the fund account. For example, `fa_00000000000001`.
   */
  fund_account_id: string;
  /**
   * The payout amount, in paise. For example, if you want to transfer ₹10,000, pass `1000000`. Minimum value `100`
   */
  amount: number;
  /**
   * The payout currency. Here, it is `INR`.
   */
  currency: CurrencyType;
  /**
   *  Key-value pair that can be used to store additional information about the entity.
   *  Maximum 15 key-value pairs, 256 characters (maximum) each. For example, `"note_key": "Beam me up Scotty”`.
   */
  notes: Notes;
  /**
   * The fees for the payout. This field is populated only when the payout moves to the `processing` state. For example, `5`.
   */
  fees: number;
  /**
   * The tax that is applicable for the fee being charged. This field is populated only when the payout moves to the `processing` state. For example, `1`.
   */
  tax: number;
  /**
   * The status of the payout.
   */
  status: TransactionStatus;
  /**
   * The unique transaction number linked to a payout. For example, `HDFCN00000000001`.
   */
  utr: string;
  /**
   * The mode used to make the payout.
   */
  mode: TransactionMode;
  /**
   * The purpose of the payout that is being created.
   */
  purpose: PayoutPurposetype;
  /**
   * Maximum length 40 characters. A user-generated reference given to the payout.
   *  For example, `Acme Transaction ID 12345`. You can use this field to store your own transaction ID, if any.
   */
  reference_id: string;
  /**
   * Maximum length 30 characters. Allowed characters: a-z, A-Z, 0-9 and space.
   * This is a custom note that also appears on the bank statement.
   *
   * Handy Tips
   * * If no value is passed for this parameter, it defaults to the Merchant Billing Label.
   * * Ensure that the most important text forms the first 9 characters as banks may truncate the rest as per their standards.
   */
  narration?: string;
  /**
   * This parameter is populated if the contact was created as part of a bulk upload. For example, `batch_00000000000001`.
   */
  batch_id: string;
  /**
   * The reason for the payout failing.
   */
  failure_reason: string;
  /**
   * Timestamp, in Unix, when the contact was created. For example, 1545320320.
   */
  created_at: number;
}
export interface FetchAllPayoutParams extends FetchAllQueryParams {
  /**
   * The unique identifier of the contact for which you want to fetch payouts. For example, `cont_00000000000001`.
   */
  contact_id?: string;
  /**
   * The unique identifier of the fund account for which you want to fetch payouts. For example, `fa_00000000000001`.
   */
  fund_account_id?: string;
  /**
   * The mode for which payouts are to be fetched.
   */
  mode?: FetchAllPayoutMode;
  /**
   * Maximum length 40 characters. The user-generated reference for which payouts are to be fetched. For example, `Acme Transaction ID 12345`.
   */
  reference_id?: string;
  /**
   * Payout status for which payouts are to be fetched.
   */
  status?: TransactionStatus;
}

export default function payout(axiosClient: AxiosClient) {
  const BASE_URL = '/payouts';
  return {
    /**
     * Create a payout.
     *
     * https://razorpay.com/docs/razorpayx/api/payouts/#create-a-payout
     * @param params New Contact Parameters
     * @returns
     */
    async create(params: CreatePayoutParams) {
      const url = BASE_URL;
      return axiosClient.post<Payout>({ url, data: params });
    },
    /**
     * Cancel a queued payout.
     *
     * https://razorpay.com/docs/razorpayx/api/payouts/#cancel-a-queued-payout
     * @param payoutId This is the unique identifier linked to the payout. For example, `pout_00000000000001`.
     * @returns
     */
    async cancelQueuedPayout(payoutId: string) {
      if (!payoutId) {
        throw new RazorpayxError('`payoutId` is missing');
      }
      const url = `${BASE_URL}/${payoutId}/cancel`;
      return axiosClient.post<Payout>({ url });
    },
    /**
     * Fetch details of all available payouts in the system.
     *
     * https://razorpay.com/docs/razorpayx/api/payouts/#fetch-all-payouts
     * @param params query paramaters {@link FetchAllPayoutParams}
     * @param accountNumber The account from which you want to make the payout.
     * Account details can be found on the RazorpayX Dashboard. For example, 7878780080316316.
     * * Pass your virtual account number if you want money to be deducted from your virtual account.
     * * Pass your current account number if you want money to be deducted from your current account.
     * Watch Out!
     * This is NOT your contact's bank account number.
     * @returns
     */
    async fetchAll(accountNumber: string, params: FetchAllPayoutParams) {
      if (!accountNumber) {
        throw new RazorpayxError('`accountNumber` is missing');
      }
      let { from, to, count, skip } = params;
      const url = `${BASE_URL}?account_number=${accountNumber}`;
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
      return axiosClient.get<FetchAllResponse<Payout>>({ url, data: { ...params, from, to, count, skip } });
    },
    /**
     * Fetch details of a required payout.
     *
     * https://razorpay.com/docs/razorpayx/api/payouts/#fetch-a-payout-by-id
     * @param payoutId This is the unique identifier linked to the payout. For example, `pout_00000000000001`.
     * @returns The Specific payout {@link Payout}
     */
    async fetch(payoutId: string) {
      if (!payoutId) {
        throw new RazorpayxError('`payoutId` is missing');
      }
      const url = `${BASE_URL}/${payoutId}`;
      return axiosClient.get<Payout>({ url });
    },
  };
}
