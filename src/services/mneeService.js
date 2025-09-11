import Mnee from '@mnee/ts-sdk';
import {
  MNEE_PROXY_API_URL,
  PUBLIC_PROD_MNEE_API_TOKEN,
  PROD_ENV,
  SANDBOX_MNEE_API_URL,
  PUBLIC_SANDBOX_MNEE_API_TOKEN,
} from '../config/mnee.js';
import dotenv from 'dotenv';

dotenv.config();

class MneeService {
  constructor() {
    const env = process.env.MNEE_ENV || PROD_ENV;

    let apiUrl;
    let apiKey;

    if (env === 'production') {
      apiUrl = process.env.MNEE_API_URL || MNEE_PROXY_API_URL;
      apiKey = process.env.MNEE_API_KEY || PUBLIC_PROD_MNEE_API_TOKEN;
    } else if (env === 'sandbox') {
      apiUrl = process.env.MNEE_API_URL || SANDBOX_MNEE_API_URL;
      apiKey = process.env.MNEE_API_KEY || PUBLIC_SANDBOX_MNEE_API_TOKEN;
    } else {
      throw new Error('Invalid environment. Must be either "production" or "sandbox"');
    }

    this.mnee = new Mnee({
      apiUrl,
      apiKey,
      environment: env,
    });
  }

  async getBalance(address) {
    return await this.mnee.balance(address);
  }

  async getBalances(addresses) {
    return await this.mnee.balances(addresses);
  }

  async transfer(request, wif, options) {
    return await this.mnee.transfer(request, wif, options);
  }

  // Add other service methods as needed
}

export default new MneeService();
