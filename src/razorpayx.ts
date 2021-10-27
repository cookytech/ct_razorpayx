import npmPackage from '../package.json';
import Contacts from './resources/contacts';
import FundAccount from './resources/fund-account';
import Payout from './resources/payout';
import Transaction from './resources/transactions';
import PayoutLink from './resources/payout-link';
import AxiosClient from './utils/axios-client';
import { Headers } from './types/types';
import RazorpayxError from './utils/razorpayx_error';

/**
 * https://razorpay.com/docs/razorpayx/api/
 *
 * Post sign up, account activation and KYC verification you are eligible to make payouts. To make a payout, you must:
 ** Create a Contact.
 ** Add a Fund Account for a contact.
 ** Create a Payout.
 */
class Razorpayx {
  static VERSION = npmPackage.version || '1.0.0';
  static PACKAGE_NAME = npmPackage.name || 'ct_razorpayx';
  contacts: ReturnType<typeof Contacts>;
  fundAccount: ReturnType<typeof FundAccount>;
  payout: ReturnType<typeof Payout>;
  transaction: ReturnType<typeof Transaction>;
  payoutLink: ReturnType<typeof PayoutLink>;
  constructor(options: { key_id: string; key_secret: string; headers?: Headers }) {
    const { key_id, key_secret, headers } = options;

    if (!key_id) {
      throw new RazorpayxError('`key_id` is mandatory');
    }

    if (!key_secret) {
      throw new RazorpayxError('`key_secret` is mandatory');
    }

    const axiosClient = new AxiosClient({
      hostUrl: 'https://api.razorpay.com/v1/',
      ua: `${Razorpayx.PACKAGE_NAME}@${Razorpayx.VERSION}`,
      key_id,
      key_secret,
      headers,
    });
    this.contacts = Contacts(axiosClient);
    this.fundAccount = FundAccount(axiosClient);
    this.payout = Payout(axiosClient);
    this.transaction = Transaction(axiosClient);
    this.payoutLink = PayoutLink(axiosClient);
  }
}

export default Razorpayx;
