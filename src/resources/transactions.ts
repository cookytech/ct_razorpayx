import {
  CurrencyType,
  FetchAllResponse,
  FetchAllQueryParams,
  Notes,
  TransactionMode,
  TransactionStatus,
} from '../types/types';
import AxiosClient from '../utils/axios-client';
import { normalizeDate } from '../utils/utils';

export interface Transaction {
  id: string;
  entity: string;
  account_number: string;
  amount: number;
  currency: CurrencyType;
  credit: number;
  debit: number;
  balance: number;
  source: TransactionSource;
  fees: number;
  tax: number;
  status: TransactionStatus;
  utr: string;
  mode: string;
  created_at: number;
}

export interface TransactionSource {
  id: string;
  entity: string;
  amount: number;
  fund_account_id: string;
  notes: Notes;
  payer_name: string;
  payer_contact: string;
  payer_ifsc: string;
  mode: TransactionMode;
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
     * @returns
     */
    async fetchAll(accountNumber: string, params: FetchAllQueryParams) {
      let { from, to, count, skip } = params;
      const url = `${BASE_URL}?account_number=${accountNumber}`;
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
        throw new Error('`transactionId` is missing');
      }
      let url = `${BASE_URL}/${transactionId}`;
      return axiosClient.get<Transaction>({ url });
    },
  };
}
