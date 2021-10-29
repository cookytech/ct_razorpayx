import { FetchAllResponse, FetchAllQueryParams, Notes } from '../types/types';
import AxiosClient from '../utils/axios-client';
import RazorpayxError from '../utils/razorpayx_error';
import { normalizeDate } from '../utils/utils';

export enum UserType {
  vendor = 'vendor',
  customer = 'customer',
  employee = 'employee',
  self = 'self',
}
export interface CreateContactParams {
  /**
   * The contact's name. This field is case-sensitive.
   * A minimum of 3 characters and a maximum of 50 characters are allowed.
   * Name cannot end with a special character, except .. Supported
   * characters: `a-z`, `A-Z`, `0-9`, `space`, `’` , `-` , `_` , `/` , `(` , `)` and , `.`.
   * For example, `Gaurav Kumar`.
   */
  name: string;
  /**
   * The contact's email address. For example, `gaurav.kumar@example.com`.
   */
  email?: string;
  /**
   * The contact's phone number. For example, `9123456789`.
   */
  contact?: string;
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
  /**
   * Maximum 40 characters. A user-entered reference for the contact. For example, `Acme Contact ID 12345`
   */
  reference_id?: string;
  /**
   * Key-value pair that can be used to store additional information about the entity.
   * Maximum 15 key-value pairs, 256 characters (maximum) each. For example, `"note_key": "Beam me up Scotty”`.
   */
  notes?: Notes;
}
export interface UpdateContactParams {
  /**
   * The contact's name. This field is case-sensitive.
   * A minimum of 3 characters and a maximum of 50 characters are allowed.
   * Name cannot end with a special character, except .. Supported
   * characters: `a-z`, `A-Z`, `0-9`, `space`, `’` , `-` , `_` , `/` , `(` , `)` and , `.`.
   * For example, `Gaurav Kumar`.
   */
  name: string;
  /**
   * The contact's email address. For example, `gaurav.kumar@example.com`.
   */
  email?: string;
  /**
   * The contact's phone number. For example, `9123456789`.
   */
  contact?: string;
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
  /**
   * Maximum 40 characters. A user-entered reference for the contact. For example, `Acme Contact ID 12345`
   */
  reference_id?: string;
  /**
   * Key-value pair that can be used to store additional information about the entity.
   * Maximum 15 key-value pairs, 256 characters (maximum) each. For example, `"note_key": "Beam me up Scotty”`.
   */
  notes?: Notes;
}
export interface Contact {
  /**
   * The unique identifier linked to the contact. For example, `cont_00000000000001`.
   */
  id: string;
  /**
   * The entity being created. Here, it will be `contact`.
   */
  entity: string;
  /**
   * The contact's name. For example, `Gaurav Kumar`.
   */
  name: string;
  /**
   * The contact's phone number. For example, `9123456789`.
   */
  contact: string;
  /**
   * The contact's email address. For example, `gaurav.kumar@example.com`.
   */
  email: string;
  /**
   * A classification for the contact being created. For example, `employee`.
   */
  type: UserType | string;
  /**
   * A user-entered reference for the contact. For example, `Acme Contact ID 12345`.
   */
  reference_id: string;
  /**
   * This parameter is populated if the contact was created as part of a bulk upload. For example, `batch_00000000000001`.
   */
  batch_id: string;
  /**
   * Possible values:
   * * `true` (default) = active
   * * `false` = inactive
   */
  active: boolean;
  /**
   *  Key-value pair that can be used to store additional information about the entity.
   *  Maximum 15 key-value pairs, 256 characters (maximum) each. For example, `"note_key": "Beam me up Scotty”`.
   */
  notes: Notes;
  /**
   * Timestamp, in Unix, when the contact was created. For example, `1545320320`.
   */
  created_at: number;
}

export interface FetchContactQueryParams extends FetchAllQueryParams {
  /**
   * Name by which results should be filtered. For example, `Gaurav`.
   */
  name?: string;
  /**
   * Email address by which results should be filtered. For example, `gaurav.kumar@example.com`.
   */
  email?: string;
  /**
   * Phone number by which results should be filtered. For example, `9123456789`.
   */
  contact?: string;
  /**
   * The user-generated reference by which results should be filtered.
   * For example, `Acme Contact ID 12345`. Maximum length 40 characters.
   */
  reference_id?: string;
  /**
   * The state by which results should be filtered. Possible values:
   * * `true` = active
   * * `false` = inactive
   */
  active?: boolean;
  /**
   * The classification by which results should be filtered. Possible values:
   * * vendor
   * * customer
   * * employee
   * * self
   *
   *  or
   * any additional classifications  created via the [Dashboard](https://x.razorpay.com).
   */
  type?: UserType | string;
}

export default function contacts(axiosClient: AxiosClient) {
  const BASE_URL = '/contacts';
  return {
    /**
     * Create a contact.
     *
     * * A new contact is created if any combination of the following details is unique: name, email, contact, type and reference_id.
     *
     * * If all the above details match the details of an existing contact, the API returns details of the existing contact.
     *
     * * Use the Update Contact API (`contacts.update`) if you want to make changes to an existing contact.
     *
     * https://razorpay.com/docs/razorpayx/api/contacts/#create-a-contact
     * @param params New Contact Parameters
     * @returns
     */
    async create(params: CreateContactParams) {
      const { name } = params;
      if (name.length < 3 || name.length > 100) {
        throw new RazorpayxError('`name` should be 3 to 50 characters long');
      }
      const url = BASE_URL;
      return axiosClient.post<Contact>({ url, data: params });
    },
    /**
     * Update details for an existing contact. Only send parameters you want to change in the request body.
     *
     * https://razorpay.com/docs/razorpayx/api/contacts/#update-a-contact
     * @param contactId The unique identifier linked to the contact. For example, `cont_00000000000001`
     * @param params Update Contact Parameters
     * @returns
     */
    async update(contactId: string, params: UpdateContactParams) {
      if (!contactId) {
        throw new RazorpayxError('`contactId` is missing');
      }
      const url = `${BASE_URL}/${contactId}`;
      return axiosClient.patch<Contact>({ url, data: params });
    },
    /**
     * Activate or deactivate a contact. This helps you block payouts to certain contacts, as and when required.
     *
     * https://razorpay.com/docs/razorpayx/api/contacts/#activate-or-deactivate-a-contact
     * @param contactId The unique identifier linked to the contact. For example, `cont_00000000000001`
     * @param active The state to which you want to move the contact.
     * A contact can have the following two states:
     *
     * `true` (default) = active
     *
     * `false` = inactive
     *
     * Pass `false` to deactivate an active contact and pass `true` to activate a deactivated contact.
     * @returns
     */
    async toggleActiveContact(contactId: string, active: boolean) {
      if (!contactId) {
        throw new RazorpayxError('`contactId` is missing');
      }
      if (active === undefined) {
        throw new RazorpayxError('`active` is missing');
      }
      return axiosClient.patch<Contact>({ url: `/contacts/${contactId}`, data: { active } });
    },
    /**
     * Fetch details of all contacts.
     *
     * https://razorpay.com/docs/razorpayx/api/contacts/#fetch-all-contacts
     * @param params query paramaters {@link FetchContactQueryParams}
     * @returns
     */
    async fetchAll(params: FetchContactQueryParams) {
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
      return axiosClient.get<FetchAllResponse<Contact>>({ url, data: { ...params, from, to, count, skip } });
    },
    /**
     * Fetch details of a specific contact.
     *
     * https://razorpay.com/docs/razorpayx/api/contacts/#fetch-a-contact-by-id
     * @param contactId The unique identifier linked to the contact. For example, `cont_00000000000001`
     * @returns The Specific Contact {@link Contact}
     */
    async fetch(contactId: string) {
      if (!contactId) {
        throw new RazorpayxError('`contactId` is missing');
      }
      const url = `${BASE_URL}/${contactId}`;
      return axiosClient.get<Contact>({ url });
    },
  };
}
