import { CurrencyType, FetchAllResponse, FetchAllQueryParams, Notes } from '../types/types';
import AxiosClient from '../utils/axios-client';
import { normalizeDate } from '../utils/utils';
import { PayoutPurposetype } from './payout';

export interface CreatePayoutLinkParams {
  account_number: string;
  contact: PayoutLinkContact;
  amount: number;
  currency: CurrencyType;
  purpose: PayoutPurposetype;
  description?: string;
  receipt: string;
  send_sms?: boolean;
  send_email?: boolean;
  notes?: Notes;
  expire_by?: number | string | Date;
}

export interface PayoutLinkContact {
  id?: string;
  name?: string;
  contact?: string;
  email?: string;
  type?: string;
}

export enum PayoutLinkStatus {
  issued = 'issued',
  processing = 'processing',
  processed = 'processed',
  cancelled = 'cancelled',
}
export interface PayoutLink {
  id: string;
  entity: string;
  contact_id: string;
  contacty?: PayoutLinkContact;
  fund_account_id: string;
  payout_id: string;
  purpose: PayoutPurposetype;
  status: PayoutLinkStatus;
  amount: number;
  currency: CurrencyType;
  description: string;
  attempt_count: number;
  receipt: string;
  notes: Notes;
  short_url: string;
  send_sms: boolean;
  send_email: boolean;
  created_at: number;
  cancelled_at: number;
  expire_by: number;
  expire_at: number;
}

export interface FetchAllPayoutLinkParams extends FetchAllQueryParams {
  id?: string;
  contact_id?: string;
  contact_phone_number?: string;
  contact_email?: string;
  fund_account_id?: string;
  purpose?: PayoutPurposetype;
  status?: PayoutLinkStatus;
  receipt?: string;
  short_url?: string;
}

export default function payoutLink(axiosClient: AxiosClient) {
  const BASE_URL = '/payout-links';
  return {
    /**
     * Create a payout link.
     *
     * https://razorpay.com/docs/razorpayx/api/payout-links/#create-a-payout-link
     * @param params New Payout link parameters.
     * @returns
     */
    async create(params: CreatePayoutLinkParams) {
      const contact = params.contact;
      if (!contact.id) {
        if (!contact.name) {
          throw new Error('`contact name` is required if not providing id');
        }
        if (!contact.email && !contact.contact) {
          throw new Error('either contact or email mandatory if id is not used');
        }
      }
      let expire_by = params.expire_by;
      if (expire_by) {
        expire_by = normalizeDate(expire_by);
      }
      let url = BASE_URL;
      return axiosClient.post<PayoutLink>({ url, data: { ...params, expire_by } });
    },
    /**
     * Cancel a payout link. You can only cancel payout links in the issued state.
     *
     * https://razorpay.com/docs/razorpayx/api/payout-links/#cancel-a-payout-link
     * @param payoutLinkId The unique identifier for the payout link. For example, `poutlk_00000000000003`.
     * @returns
     */
    async cancelPayoutLink(payoutLinkId: string) {
      if (!payoutLinkId) {
        throw new Error('`payoutLinkId` is missing');
      }
      let url = `${BASE_URL}/${payoutLinkId}/cancel`;
      return axiosClient.post<PayoutLink>({ url });
    },
    /**
     * Fetch all payout links.
     *
     * https://razorpay.com/docs/razorpayx/api/payout-links/#fetch-all-payout-links
     * @param params query paramaters {@link FetchAllPayoutLinkParams}
     * @returns
     */
    async fetchAll(params: FetchAllPayoutLinkParams) {
      let { from, to, count, skip } = params;
      let url = `${BASE_URL}`;
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
      return axiosClient.get<FetchAllResponse<PayoutLink>>({ url, data: { ...params, from, to, count, skip } });
    },
    /**
     * Fetch details of a  payout link.
     *
     * https://razorpay.com/docs/razorpayx/api/payout-links/#fetch-payout-link-by-id
     * @param payoutLinkId he unique identifier for the payout link. For example, poutlk_00000000000001.
     * @returns The Specific payoutlink {@link Payoutlink}
     */
    async fetch(payoutLinkId: string) {
      if (!payoutLinkId) {
        throw new Error('`payoutLinkId` is missing');
      }
      let url = `${BASE_URL}/${payoutLinkId}`;
      return axiosClient.get<PayoutLink>({ url });
    },
  };
}
