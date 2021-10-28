'use strict';

import axios, { AxiosError, AxiosInstance } from 'axios';
import { Headers } from '../types/types';
import RazorpayxError, { RazorpayxErrorResponse } from './razorpayx_error';
import { isNonNullObject } from './utils';

const allowedHeaders = {
  'X-Razorpay-Account': '',
};

function getValidHeaders(headers?: Headers) {
  const result: Headers = {};

  if (!headers || !isNonNullObject(headers)) {
    return result;
  }

  return Object.keys(headers).reduce((_, headerName): Headers => {
    if (Object.prototype.hasOwnProperty.call(allowedHeaders, headerName)) {
      result[headerName] = headers[headerName];
    }

    return result;
  }, result);
}

class AxiosClient {
  axiosInstance: AxiosInstance;
  constructor(options: { hostUrl?: string; ua: string; key_id: string; key_secret: string; headers?: Headers }) {
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
    try {
      return await this.axiosInstance.get<ResponseType>(params.url, { params: params.data });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        onError(error as AxiosError<RazorpayxErrorResponse>);
      }
    }
  }

  async post<ResponseType = any>(params: { url: string; data?: any }) {
    try {
      return await this.axiosInstance.post<ResponseType>(params.url, params.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        onError(error as AxiosError<RazorpayxErrorResponse>);
      }
    }
  }
  async patch<ResponseType = any>(params: { url: string; data: any }) {
    try {
      return await this.axiosInstance.patch<ResponseType>(params.url, params.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        onError(error as AxiosError<RazorpayxErrorResponse>);
      }
    }
  }
}
function onError(error: AxiosError<RazorpayxErrorResponse>) {
  throw new RazorpayxError('Razorpayx API Error', error.response?.data.error, error.response?.status);
}

export default AxiosClient;
