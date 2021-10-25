import npmPackage from '../package.json';
import Contacts from './resources/contacts';
import AxiosClient from './utils/axios_client';

class Razorpayx {
  static VERSION = npmPackage.version || '1.0.0';
  static PACKAGE_NAME = npmPackage.name || 'ctrazorpayx';
  contacts: ReturnType<typeof Contacts>;

  constructor(
    options: { key_id: string; key_secret: string; headers?: { [key: string]: string } } = {
      key_id: '',
      key_secret: '',
    },
  ) {
    const { key_id, key_secret, headers } = options;

    if (!key_id) {
      throw new Error('`key_id` is mandatory');
    }

    if (!key_secret) {
      throw new Error('`key_secret` is mandatory');
    }

    const axiosClient = new AxiosClient({
      hostUrl: 'https://api.razorpay.com/v1/',
      ua: `${Razorpayx.PACKAGE_NAME}@${Razorpayx.VERSION}`,
      key_id,
      key_secret,
      headers,
    });
    this.contacts = Contacts(axiosClient);
  }
}

export default Razorpayx;
