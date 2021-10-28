import crypto from 'crypto';

export const isNonNullObject = (input: any) => {
  return !!input && typeof input === 'object' && !Array.isArray(input);
};

export function getDateInSecs(date: string | Date) {
  return +new Date(date) / 1000;
}

export const isDefined = (value?: string) => {
  return typeof value !== 'undefined';
};

export function normalizeDate(date: number | string | Date) {
  return typeof date === 'number' ? date : getDateInSecs(date);
}
export function validateWebhookSignature(body: string, signature: string, secret: string) {
  if (!isDefined(body) || !isDefined(signature) || !isDefined(secret)) {
    throw Error(
      'Invalid Parameters: Please give request body,' +
        'signature sent in X-Razorpay-Signature header and ' +
        'webhook secret from dashboard as parameters',
    );
  }

  body = body.toString();

  const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');

  return expectedSignature === signature;
}
