import * as Paths from '../paths';
import { RequestPromise } from './request-wrapper';
import { Logger } from '@hmcts/nodejs-logging';
const logger = Logger.getLogger('login.js');
const i18next = require('i18next');
const config = require('config');
const httpRetries = 3;

export interface TokenResponse {
  access_token: string;
}

export interface UserDetails {
  email: string;
}

export class IdamService {
  private apiUrl: string;
  private appPort: string;
  private appSecret: string;

  constructor(apiUrl: string, appPort: string, appSecret: string) {
    this.apiUrl = apiUrl;
    this.appPort = appPort;
    this.appSecret = appSecret;
  }

  async getToken(code: string, protocol: string, host: string): Promise<TokenResponse> {
    const redirectUri: string = this.getRedirectUrl(protocol, host);

    return RequestPromise.request({
      method: 'POST',
      retry: httpRetries,
      uri: `${this.apiUrl}/oauth2/token`,
      auth: {
        user: 'sscs',
        pass: this.appSecret
      },
      form: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        ui_locales: i18next.language
      }
    });
  }

  async deleteToken(token: string): Promise<void> {
    return RequestPromise.request({
      method: 'DELETE',
      retry: httpRetries,
      uri: `${this.apiUrl}/session/${token}`,
      auth: {
        user: 'sscs',
        pass: this.appSecret
      }
    });
  }

  async getUserDetails(token: string): Promise<UserDetails> {
    return RequestPromise.request({
      method: 'GET',
      retry: httpRetries,
      uri: `${this.apiUrl}/details`,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  getUrl(protocol: string, host: string, path: string): string {
    const portString = (host === 'localhost') ? ':' + this.appPort : '';
    return protocol + '://' + host + portString + path;
  }

  getRedirectUrl(protocol: string, host: string): string {
    return this.getUrl(protocol, host, Paths.login);
  }

  getRegisterUrl(protocol: string, host: string): string {
    return this.getUrl(protocol, host, Paths.register);
  }
}
