export interface Notes {
  [key: string]: string;
}
export interface FetchQueryParams {
  from?: number | string | Date;
  to?: number | string | Date;
  count?: number;
  skip?: number;
}
