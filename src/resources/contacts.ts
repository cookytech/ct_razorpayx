import { Notes } from '../types/types';
import AxiosClient from '../utils/axios_client';

enum ContactType {
  vendor = 'vendor',
  customer = 'customer',
  employee = 'employee',
  self = 'self',
}
interface CreateContactParams {
  name: string;
  email?: string;
  contact?: string;
  type?: ContactType | string;
  reference_id?: string;
  notes: Notes;
}

interface CreateContactResponse {
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
export default function contacts(axiosClient: AxiosClient) {
  return {
    async create(params: CreateContactParams) {
      return axiosClient.post<CreateContactResponse>({ url: '/contacts', data: params });
    },
  };
}
