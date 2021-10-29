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

export interface Transaction {
  /**
   * The unique identifier linked to the transaction. For example, `txn_00000000000001`.
   */
  id: string;
  /**
   * The entity being created. Here, it will be `transaction`.
   */
  entity: string;
  /**
   * This is the business account from which the payout was made. For example, `7878780080316316`.
   */
  account_number: string;
  /**
   * The amount transferred, in paise. The transfer can either be a
   * credit (when you add funds to your account) or a debit (when you make a payout).
   *
   * Handy Tip The value passed here does not include fees and tax. Fees and tax,
   * if any, are deducted from your account balance.
   */
  amount: number;
  /**
   * The transaction currency. Here, it is INR.
   */
  currency: CurrencyType;
  /**
   * The amount, in paise, credited to your account. Will be 0 for debit transactions (when making payouts).
   */
  credit: number;
  /**
   * The amount, in paise, debited to your account. Will be 0 for credit transactions (when adding funds to your account).
   */
  debit: number;
  /**
   * The remaining amount, in paise, in your account after the debit or credit transaction.
   */
  balance: number;
  /**
   * Details of the payout made or details of the bank account from which money is being added to your business account.
   */
  source: TransactionSource;
  /**
   * The fees, in paise, for the transaction. This field is populated only when the transaction moves to the `processing` state. For example, `5`.
   */
  fees: number;
  /**
   *  The tax, in paise, for the fee being charged. This field is populated only when the transaction moves to the `processing` state. For example, `1`.
   */
  tax: number;
  /**
   * The status of the transaction
   */
  status: TransactionStatus;
  /**
   * The unique transaction number for the transaction. For example, HDFCN00000000001.
   */
  utr: string;
  /**
   * The payout mode. Refer to the [Supported Banks and Payout Modes section](https://razorpay.com/docs/razorpayx/api/transactions-cards/#supported-banks-and-transaction-modes) for more details.
   */
  mode: string;
  /**
   * Timestamp, in Unix, when the source entity or transaction entity was created. For example, 1545320320.
   */
  created_at: number;
}

export interface TransactionSource {
  /**
   * The payout ID when making payouts or the bank transfer ID when adding fund to your account.
   */
  id: string;
  /**
   * The entity for which the transaction was created. Possible values:
   * * payout
   * * bank_transfer
   */
  entity: string;
  /**
   * The amount transferred, in paise.
   */
  amount: number;
  /**
   * The unique identifier linked to the fund account. For example, `fa_00000000000001`.
   */
  fund_account_id: string;
  /**
   * User-entered notes for internal reference. This is a key-value pair. You can enter
   *  a maximum of 15 key-value pairs. For example, `"note_key": "Beam me up Scotty”`.
   */
  notes: Notes;
  /**
   * Name linked to the account making the transfer. For example, `Saurav Kumar`.
   */
  payer_name: string;
  /**
   * The account number from which money is transferred to your business bank account. For example, `6543266545411243`.
   */
  payer_contact: string;
  /**
   * The branch IFSC from where the transfer is being made. For example, `UTIB0000002`.
   */
  payer_ifsc: string;
  /**
   *  The mode used to transfer money to your business bank account. For example, `NEFT`.
   */
  mode: TransactionMode;
  /**
   * Reference from the bank from which money was transferred to your business bank account. For example, `AXIR000000000001`.
   */
  bank_reference: string;
}
export default function transactions(axiosClient: AxiosClient) {
  const BASE_URL = '/transactions';
  return {
    /**
     * Fetch details of all transaction.
     *
     * https://razorpay.com/docs/razorpayx/api/transactions/#fetch-all-transactions
     * @param params query paramaters {@link FetchQueryParams}
     * @param accountNumber The account from which you want to make the payout.
     * Account details can be found on the RazorpayX Dashboard. For example, `7878780080316316`.
     * Watch Out!
     * This is NOT your contact's bank account number.
     * @returns
     */
    async fetchAll(accountNumber: string, params: FetchAllQueryParams) {
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
      return axiosClient.get<FetchAllResponse<Transaction>>({ url, data: { ...params, from, to, count, skip } });
    },
    /**
     * Fetch details of the required transaction.
     *
     * https://razorpay.com/docs/razorpayx/api/transactions/#fetch-transaction-by-id
     * @param transactionId The unique identifier linked to the transaction. For example, `txn_00000000000002`.
     * @returns The Specific Transaction {@link Transaction}
     */
    async fetch(transactionId: string) {
      if (!transactionId) {
        throw new RazorpayxError('`transactionId` is missing');
      }
      const url = `${BASE_URL}/${transactionId}`;
      return axiosClient.get<Transaction>({ url });
    },
  };
}
