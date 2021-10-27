export type ErrorType = { [key: string]: any };

export default class RazorpayxError extends Error {
  statusCode: number;
  error?: RazorpayxErrorInfo;
  constructor(message: string, error?: RazorpayxErrorInfo, statusCode?: number | undefined) {
    super(message);
    this.statusCode = statusCode || -1;
    this.error = error;
  }
}

export interface RazorpayxErrorResponse {
  error: RazorpayxErrorInfo;
}
export interface RazorpayxErrorInfo {
  code: string;
  description: string;
  source: 'buisness' | 'internal';
  reasons: string;
  step: string | undefined;
  metadtype: any;
}
