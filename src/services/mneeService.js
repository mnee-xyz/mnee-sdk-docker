import Mnee from "@mnee/ts-sdk";
import {
  MNEE_PROXY_API_URL,
  PUBLIC_PROD_MNEE_API_TOKEN,
  PROD_ENV,
  SANDBOX_MNEE_API_URL,
  PUBLIC_SANDBOX_MNEE_API_TOKEN,
} from "../config/mnee.js";
import dotenv from "dotenv";

dotenv.config();

class MneeService {
  constructor() {
    const env = process.env.MNEE_ENV || PROD_ENV;

    let apiUrl;
    let apiKey;

    if (env === "production") {
      apiUrl = process.env.MNEE_API_URL || MNEE_PROXY_API_URL;
      apiKey = process.env.MNEE_API_KEY || PUBLIC_PROD_MNEE_API_TOKEN;
    } else if (env === "sandbox") {
      apiUrl = process.env.MNEE_API_URL || SANDBOX_MNEE_API_URL;
      apiKey = process.env.MNEE_API_KEY || PUBLIC_SANDBOX_MNEE_API_TOKEN;
    } else {
      throw new Error(
        'Invalid environment. Must be either "production" or "sandbox"'
      );
    }

    this.mnee = new Mnee({
      apiUrl,
      apiKey,
      environment: env,
    });
  }

  async config() {
    return this.mnee.config();
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

  async getUtxos(address, page, size, order) {
    return await this.mnee.getUtxos(address, page, size, order);
  }

  async getEnoughUtxos(address, totalAtomicTokenAmount) {
    return await this.mnee.getEnoughUtxos(address, totalAtomicTokenAmount);
  }

  async getAllUtxos(address) {
    return await this.mnee.getAllUtxos(address);
  }

  async transfer(request, wif, transferOptions) {
    return this.mnee.transfer(request, wif, transferOptions);
  }

  async transferMulti(options, transferOptions) {
    return this.mnee.transferMulti(options, transferOptions);
  }

  async submitRawTx(rawTxHex, transferOptions) {
    return this.mnee.submitRawTx(rawTxHex, transferOptions);
  }

  async getTxStatus(ticketId) {
    return this.mnee.getTxStatus(ticketId);
  }

  async getRecentTxHistory(address, fromScore, limit, order) {
    return this.mnee.recentTxHistory(address, fromScore, limit, order);
  }

  async getRecentTxHistories(params) {
    return this.mnee.recentTxHistories(params);
  }

  async parseTx(txid, options) {
    return this.mnee.parseTx(txid, options);
  }

  async parseTxFromRawTx(rawTxHex, options) {
    return this.mnee.parseTxFromRawTx(rawTxHex, options);
  }

  parseInscription(script) {
    return this.mnee.parseInscription(script);
  }

  parseCosignerScripts(scripts) {
    return this.mnee.parseCosignerScripts(scripts);
  }

  async validateMneeTx(rawTxHex, request) {
     return await this.mnee.validateMneeTx(rawTxHex, request);
  }

  toAtomicAmount(amount) {
    return this.mnee.toAtomicAmount(amount);
  }

  fromAtomicAmount(atomicAmount) {
    return this.mnee.fromAtomicAmount(atomicAmount);
  }
}

export default new MneeService();
