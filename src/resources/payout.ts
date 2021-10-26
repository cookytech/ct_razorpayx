import { FetchQueryParams, Notes } from '../types/types';
import AxiosClient from '../utils/axios-client';
import { normalizeDate } from '../utils/utils';
export enum PayoutPurposetype {
  refund = 'refund',
  cashback = 'cashback',
  payout = 'payout',
  salary = 'salary',
  utilityBill = 'utility bill',
  vendorBill = 'vendor bill',
}
export enum PayoutStatustype {
  queued = 'queued',
  pending = 'pending',
  rejected = 'rejected',
  processing = 'processing',
  processed = 'processed',
  cancelled = 'cancelled',
  reversed = 'reversed',
}

type CurrencyType = 'INR';
type PayoutMode = 'NEFT' | 'RTGS' | 'IMPS';
type FetchAllPayoutMode = 'NEFT' | 'RTGS' | 'IMPS' | 'UPI' | 'amazonpay';
export interface CreatePayoutParams {
  account_number: string;
  fund_account_id: string;
  amount: number;
  currency: CurrencyType;
  mode: PayoutMode;
  purpose: PayoutPurposetype;
  queue_if_low_balance?: boolean;
  reference_id?: string;
  narration?: string;
  notes?: Notes;
}

export interface Payout {
  id: string;
  entity: string;
  fund_account_id: string;
  amount: number;
  currency: CurrencyType;
  notes: Notes;
  fees: number;
  tax: number;
  status: PayoutStatustype;
  utr: string;
  mode: PayoutMode;
  purpose: PayoutPurposetype;
  reference_id: string;
  narration?: string;
  batch_id: string;
  failure_reason: string;
  created_at: number;
}
export interface FetchAllPayoutParams extends FetchQueryParams {
  contact_id?: string;
  fund_account_id?: string;
  mode?: FetchAllPayoutMode;
  reference_id?: string;
  status?: PayoutStatustype;
}

export interface FetchAllResponse<Type> {
  entity: string;
  count: number;
  items: Type[];
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
      let url = BASE_URL;
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
        throw new Error('`payoutId` is missing');
      }
      let url = `${BASE_URL}/${payoutId}/cancel`;
      return axiosClient.post<Payout>({ url });
    },
    /**
     * Fetch details of all available payouts in the system.
     *
     * https://razorpay.com/docs/razorpayx/api/payouts/#fetch-all-payouts
     * @param params query paramaters {@link FetchAllPayoutParams}
     * @returns
     */
    async fetchAll(accountNumber: string, params: FetchAllPayoutParams) {
      if (!accountNumber) {
        throw new Error('`accountNumber` is missing');
      }
      let { from, to, count, skip } = params;
      let url = `${BASE_URL}?account_number=${accountNumber}`;
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
      return axiosClient.get<FetchAllResponse<Payout>>({ url, data: { ...params, from, to, count, skip } });
    },
    /**
     * Fetch details of a srequired payout.
     *
     * https://razorpay.com/docs/razorpayx/api/payouts/#fetch-a-payout-by-id
     * @param payoutId This is the unique identifier linked to the payout. For example, `pout_00000000000001`.
     * @returns The Specific payout {@link Payout}
     */
    async fetch(payoutId: string) {
      if (!payoutId) {
        throw new Error('`payoutId` is missing');
      }
      let url = `${BASE_URL}/${payoutId}`;
      return axiosClient.get<Payout>({ url });
    },
  };
}
