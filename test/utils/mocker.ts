import nock from 'nock';

export interface MockResponse {
  success: boolean;
  __JUST_FOR_TESTS__: JustForTests;
}

interface JustForTests {
  url: string;
  method: string;
  requestQueryParams: any;
  requestBody: any;
  headers: any;
}
const FIXTURES = {
  error: {
    error: {
      code: 'BAD_REQUEST_ERROR',
      description: 'The count may not be greater than 100.',
      field: 'count',
    },
  },
};

export const mock = function (params: any) {
  const host = 'https://api.razorpay.com';
  const version = 'v1';
  const { url, method = 'GET', requestBody, replyWithError } = params;
  const status = replyWithError ? 400 : 200;
  let requestQueryParams: any;
  const normalizedUrl = normalizeUrl(`/${version}/${url}`);
  nock(host)
    .intercept(normalizedUrl, method)
    .query((qp: any): true => {
      requestQueryParams = qp;
      return true;
    })
    .reply(status, function (url, requestBody) {
      if (replyWithError) {
        return FIXTURES.error;
      }

      return {
        success: true,
        __JUST_FOR_TESTS__: {
          url,
          method,
          requestQueryParams,
          requestBody: requestBody,
          headers: this.req.headers,
        },
      };
    });
};

const normalizeUrl = function (url: string) {
  return url.replace(/\/{2,}/g, '/');
};

export default mock;
