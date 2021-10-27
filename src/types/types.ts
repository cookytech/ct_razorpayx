export interface Notes {
  [key: string]: string;
}
export interface FetchQueryParams {
  from?: number | string | Date;
  to?: number | string | Date;
  count?: number;
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
