export interface Notes {
  [key: string]: string;
}
export interface FetchAllQueryParams {
  /**
   * Timestamp, in `Unix` or `Date` or `String`, from when contacts are to be fetched.
   */
  from?: number | string | Date;
  /**
   * Timestamp, in `Unix` or `Date` or `String`, from when contacts are to be fetched.
   */
  to?: number | string | Date;
  /**
   * The number of contacts to be fetched. Default = `10`. Maximum = `100`.
   *  This can be used for pagination, in combination with `skip`.
   */
  count?: number;
  /**
   *  The number of contacts to be skipped. Default = `0`.
   *  This can be used for pagination, in combination with `count`.
   */
  skip?: number;
}

export type CurrencyType = 'INR';
export type TransactionMode = 'NEFT' | 'RTGS' | 'IMPS';
export enum TransactionStatus {
  queued = 'queued',
  pending = 'pending',
  rejected = 'rejected',
  processing = 'processing',
  processed = 'processed',
  cancelled = 'cancelled',
  reversed = 'reversed',
}

export interface FetchAllResponse<Type> {
  entity: string;
  count: number;
  items: Type[];
}
export type Headers = { [key: string]: string };
