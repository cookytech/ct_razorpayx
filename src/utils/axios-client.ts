'use strict';

import axios, { AxiosError, AxiosInstance } from 'axios';
import { isNonNullObject } from './utils';


const allowedHeaders = {
  'X-Razorpay-Account': '',
};

function getValidHeaders(headers?: { [key: string]: string }) {
  const result: { [key: string]: string } = {};

  if (!headers || !isNonNullObject(headers)) {
    return result;
  }

  return Object.keys(headers).reduce(function (result, headerName) {
    if (Object.prototype.hasOwnProperty.call(allowedHeaders, headerName)) {
      result[headerName] = headers[headerName];
    }

    return result;
  }, result);
}

class AxiosClient {
  axiosInstance: AxiosInstance;
  constructor(options: {
    hostUrl?: string;
    ua: string;
    key_id: string;
    key_secret: string;
    headers?: { [key: string]: string };
  }) {
    this.axiosInstance = axios.create({
      baseURL: options.hostUrl,
      headers: { 'User-Agent': options.ua, ...getValidHeaders(options.headers) },
      auth: {
        username: options.key_id,
        password: options.key_secret,
      },
    });
  }

  async get<ResponseType = any>(params: { url: string; data?: any }) {
    return await this.axiosInstance.get<ResponseType>(params.url, { params: params.data });
  }

  async post<ResponseType = any>(params: { url: string; data?: any }) {
    return await this.axiosInstance.post<ResponseType>(params.url, params.data);
  }
  async patch<ResponseType = any>(params: { url: string; data: any }) {
    return await this.axiosInstance.patch<ResponseType>(params.url, params.data);
  }
}

export default AxiosClient;
