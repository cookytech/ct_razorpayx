import { FetchAllResponse, FetchAllQueryParams, Notes } from '../types/types';
import AxiosClient from '../utils/axios-client';
import { normalizeDate } from '../utils/utils';

export enum UserType {
  vendor = 'vendor',
  customer = 'customer',
  employee = 'employee',
  self = 'self',
}
export interface CreateContactParams {
  name: string;
  email?: string;
  contact?: string;
  type?: UserType | string;
  reference_id?: string;
  notes: Notes;
}
export interface UpdateContactParams {
  name?: string;
  email?: string;
  contact?: string;
  type?: UserType | string;
  reference_id?: string;
  notes: Notes;
}
export interface Contact {
  id: string;
  entity: string;
  name: string;
  contact: string;
  email: string;
  type: string;
  reference_id: string;
  batch_id: string;
  active: boolean;
  notes: Notes;
  created_at: number;
}

export interface FetchContactQueryParams extends FetchAllQueryParams {
  name?: string;
  email?: string;
  contact?: string;
  reference_id?: string;
  active?: boolean;
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
      let url = BASE_URL;
      return axiosClient.post<Contact>({ url, data: params });
    },
    /**
     * Update details for an existing contact. Only send parameters you want to change in the request body.
     *
     * DOCS: https://razorpay.com/docs/razorpayx/api/contacts/#update-a-contact
     * @param contactId The unique identifier linked to the contact. For example, `cont_00000000000001`
     * @param params Update Contact Parameters
     * @returns
     */
    async update(contactId: string, params: UpdateContactParams) {
      if (!contactId) {
        throw new Error('`contactId` is missing');
      }
      let url = `${BASE_URL}/${contactId}`;
      return axiosClient.patch<Contact>({ url, data: params });
    },
    /**
     * Activate or deactivate a contact. This helps you block payouts to certain contacts, as and when required.
     *
     * DOCS: https://razorpay.com/docs/razorpayx/api/contacts/#activate-or-deactivate-a-contact
     * @param contactId The unique identifier linked to the contact. For example, `cont_00000000000001`
     * @param active The state to which you want to move the contact.
     * A contact can have the following two states:
     *
     * `true` (default) = active
     *
     * `false` = inactive
     *
     * Pass false to deactivate an active contact and pass true to activate a deactivated contact.
     * @returns
     */
    async toggleActiveContact(contactId: string, active: boolean) {
      if (!contactId) {
        throw new Error('`contactId` is missing');
      }
      if (active == undefined) {
        throw new Error('`active` is missing');
      }
      return axiosClient.patch<Contact>({ url: `/contacts/${contactId}`, data: { active } });
    },
    /**
     * Fetch details of all contacts.
     *
     * DOCS: https://razorpay.com/docs/razorpayx/api/contacts/#fetch-all-contacts
     * @param params query paramaters {@link FetchContactQueryParams}
     * @returns
     */
    async fetchAll(params: FetchContactQueryParams) {
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
      return axiosClient.get<FetchAllResponse<Contact>>({ url, data: { ...params, from, to, count, skip } });
    },
    /**
     * Fetch details of a specific contact.
     *
     * DOCS: https://razorpay.com/docs/razorpayx/api/contacts/#fetch-a-contact-by-id
     * @param contactId The unique identifier linked to the contact. For example, `cont_00000000000001`
     * @returns The Specific Contact {@link Contact}
     */
    async fetch(contactId: string) {
      if (!contactId) {
        throw new Error('`contactId` is missing');
      }
      let url = `${BASE_URL}/${contactId}`;
      return axiosClient.get<Contact>({ url });
    },
  };
}
