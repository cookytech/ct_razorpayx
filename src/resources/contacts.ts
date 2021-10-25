import AxiosClient from '../utils/axios_client';

export default function contacts(axiosClient: AxiosClient) {
  return {
    async create(params: any) {
      return axiosClient.post({ url: '/contacts', data: params });
    },
  };
}
