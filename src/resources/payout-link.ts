import { CurrencyType, FetchAllResponse, FetchAllQueryParams, Notes } from '../types/types';
import AxiosClient from '../utils/axios-client';
import RazorpayxError from '../utils/razorpayx_error';
import { normalizeDate } from '../utils/utils';
import { UserType } from './contacts';
import { PayoutPurposetype } from './payout';

export interface CreatePayoutLinkParams {
  /**
   *  The account from which you want to make the payout.
   * Account details can be found on the RazorpayX Dashboard. For example, 7878780080316316.
   * * Pass your virtual account number if you want money to be deducted from your virtual account.
   * * Pass your current account number if you want money to be deducted from your current account.
   *
   * Watch Out!
   * This is NOT your contact's bank account number.
   */
  account_number: string;
  /**
   * Details of the contact to whom the payout link is to be sent.
   */
  contact: PayoutLinkContact;
  /**
   * The amount, in paise, to be transferred from the business account to the contact's fund account
   * . For example, if you want to transfer ₹10000, pass `1000000` against this parameter.
   *  The minimum value that can be passed is `100`.
   * Handy Tip:
   * The value passed here does not include fees and tax.
   *  Fees and tax, if any, are deducted from your account balance.
   */
  amount: number;
  /**
   * The currency in which the payout is being made. Here, it is INR.
   */
  currency: CurrencyType;
  /**
   * The purpose of the payout that is being created. For example, refund.
   */
  purpose: PayoutPurposetype;
  /**
   * A user-entered description for the payout link. For example, `Payout link for Gaurav Kumar`.
   */
  description?: string;
  /**
   * A user-entered receipt number for the payout. For example, Receipt No. 1.
   */
  receipt: string;
  /**
   * Possible values:
   * * true - Razorpay sends the payout link to the provided contact number via SMS.
   * * false (default) - You send the payout link to the contact.
   */
  send_sms?: boolean;
  /**
   * Possible values:
   * * true - Razorpay sends the payout link to the provided email address via email.
   * * false (default) - You send the payout link to the contact.
   */
  send_email?: boolean;
  /**
   * User-entered notes for internal reference. This is a key-value pair.
   * You can enter a maximum of 15 key-value pairs. For example, `"note_key": "Beam me up Scotty”`.
   */
  notes?: Notes;
  /**
   * Timestamp, in Unix or Date or String, when you want the payout link to expire. Expire By time must be at least
   * 15 minutes ahead of the current time. This field is required only when you want to set
   *  an expiry date and time for the payout link.
   */
  expire_by?: number | string | Date;
}

export interface PayoutLinkContact {
  /**
   * If you are using this, do not use the other parameters in the array.
   * The unique identifer for the contact. For example, `cont_00000000000001`.
   */
  id?: string;
  /**
   * Use this only if you are not using the id parameter.
   * The contact's name. This field is case-sensitive. A minimum of 3 characters and
   * a maximum of 50 characters are allowed. Name cannot end with a special character,
   *  except `.`. Supported characters: `a-z`,`A-Z`, `0-9`, `space`, `’` , `-` , `_` , `/` ,`(` , `)`and ,
   *  `.`. For example, `Gaurav Kumar`.
   */
  name?: string;
  /**
   * Use this only if you are not using the id parameter.
   * The contact's phone number. For example, `9123456789`.
   */
  contact?: string;
  /**
   * Use this only if you are not using the id parameter.
   * The contact's email address. For example, `gaurav.kumar@example.com`.
   */
  email?: string;
  /**
   * Maximum 40 characters. Classification for the contact being created.
   * For example, `employee`. The following classifications are available by default:
   * * vendor
   * * customer
   * * employee
   * * self
   * Additional Classifications can be created via the [Dashboard](https://x.razorpay.com) and then used in APIs.
   * It is not possible to create new Classifications via API.
   */
  type?: UserType | string;
}

export enum PayoutLinkStatus {
  issued = 'issued',
  processing = 'processing',
  processed = 'processed',
  cancelled = 'cancelled',
}
export interface PayoutLink {
  /**
   * The unique identifier of the payout link that is created. For example, `poutlk_00000000000001`.
   */
  id: string;
  /**
   * The entity being created. Here it will be `payout_link`.
   */
  entity: string;
  /**
   * The unique identifier of the contact to whom the payout link is to be sent. For example, `cont_00000000000001`.
   */
  contact_id: string;
  /**
   * Details of the contact to whom the payout link is to be sent.
   * Use this only if you are not using the `contact_id` parameter.
   */
  contact?: PayoutLinkContact;
  /**
   * The unique identifier of the contact's fund account to which the payout will be made.
   *  This field is populated only when the payout link moves to the processing state. For example, `fa_00000000000001`
   */
  fund_account_id: string;
  /**
   * The unique identifier for the payout made to the contact.
   *  This field is populated only when the payout link moves to the processed state. For example, `pout_00000000000001`.
   */
  payout_id: string;
  /**
   * The purpose of the payout. For example, `refund`.
   */
  purpose: PayoutPurposetype;
  /**
   * The payout link status.
   */
  status: PayoutLinkStatus;
  /**
   * The amount, in paise, to be transferred from the business account to the contact's fund account.
   * Handy Tip:
   * The value passed here does not include fees and tax. Fees and tax, if any, are deducted from your account balance.
   */
  amount: number;
  /**
   * The currency in which the payout is being made. Here, it is INR.
   */
  currency: CurrencyType;
  /**
   * A user-entered description for the payout link. For example, `Payout link for Gaurav Kumar`.
   */
  description: string;
  /**
   * The number of attempts to complete the payout.
   */
  attempt_count: number;
  /**
   * A user-entered receipt number for the payout. For example, `Receipt No. 1`.
   */
  receipt: string;
  /**
   * User-entered notes for internal reference. This is a key-value pair.
   *  You can enter a maximum of 15 key-value pairs. For example, `"note_key": "Beam me up Scotty”`.
   */
  notes: Notes;
  /**
   * A short link for the payout link that was created. This is the link that is shared with the contact.
   */
  short_url: string;
  /**
   *  Possible values:
   * * true - SMS sent to the provided contact number.
   * * false - SMS could not be sent to the provided contact number. This could be because the contact number provided was wrong.
   */
  send_sms: boolean;
  /**
   *  Possible values:
   * * true - Email sent to the provided email address.
   * * false - Email could not be sent to the provided email address. This could be because the email address provided was wrong.
   */
  send_email: boolean;
  /**
   * Timestamp, in Unix, when the payout link was created.
   */
  created_at: number;
  /**
   * Timestamp, in Unix, when the payout link was cancelled by you. This field is populated only when the payout link moves to the `cancelled` state.
   */
  cancelled_at: number;
  /**
   * Timestamp, in Unix, when the payout link was to expire. This is set at the time of creation of the payout link.
   *  This field is populated only if you have enabled expiry feature for Payout Links
   *  Know more about how to [enable the expiry feature](https://razorpay.com/docs/razorpayx/payout-links/#payout-link-expiry).
   */
  expire_by: number;
  /**
   * Timestamp, in Unix, when the payout link expired. This is set at the time of creation of the payout link.
   */
  expire_at: number;
}

export interface FetchAllPayoutLinkParams extends FetchAllQueryParams {
  /**
   * The unique identifier for the payout link. For example, `poutlk_00000000000001`.
   */
  id?: string;
  /**
   * The unique identifier of the contact to whom the payout link is to be sent. For example, `cont_00000000000001`.
   */
  contact_id?: string;
  /**
   * The contact's phone number. For example, `9123456789`.
   */
  contact_phone_number?: string;
  /**
   * The contact's email address. For example, `gaurav.kumar@example.com`.
   */
  contact_email?: string;
  /**
   * The unique identifier of the contact's fund account to which the payout was made. For example, `fa_00000000000001`.
   */
  fund_account_id?: string;
  /**
   * The purpose of the payout that is being created. For example, `refund`.
   */
  purpose?: PayoutPurposetype;
  /**
   * The payout link status.
   */
  status?: PayoutLinkStatus;
  /**
   *  A user-entered receipt number for the payout. For example, `Receipt No. 1`.
   */
  receipt?: string;
  /**
   * A short link for the payout link that was created. This is the link that is shared with the contact.
   */
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
          throw new RazorpayxError('`contact name` is required if not providing id');
        }
        if (!contact.email && !contact.contact) {
          throw new RazorpayxError('either contact or email mandatory if id is not used');
        }
      }
      let expire_by = params.expire_by;
      if (expire_by) {
        expire_by = normalizeDate(expire_by);
      }
      const url = BASE_URL;
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
        throw new RazorpayxError('`payoutLinkId` is missing');
      }
      const url = `${BASE_URL}/${payoutLinkId}/cancel`;
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
      const url = `${BASE_URL}`;
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
        throw new RazorpayxError('`payoutLinkId` is missing');
      }
      const url = `${BASE_URL}/${payoutLinkId}`;
      return axiosClient.get<PayoutLink>({ url });
    },
  };
}
