import hmctsCookieManager from '@hmcts/cookie-manager';

export class CookiesManager {
  public cookieManagerConfig = {
    userPreferences: {
      cookieName: 'mya-cookie-preferences',
      cookieExpiry: 365,
      cookieSecure: true,
    },
    cookieBanner: {
      class: 'cookie-banner',
      showWithPreferencesForm: false,
      actions: [
        {
          name: 'accept',
          buttonClass: 'cookie-banner-accept-button',
          confirmationClass: 'cookie-banner-accept-message',
          consent: true,
        },
        {
          name: 'reject',
          buttonClass: 'cookie-banner-reject-button',
          confirmationClass: 'cookie-banner-reject-message',
          consent: false,
        },
        {
          name: 'hide',
          buttonClass: 'cookie-banner-hide-button',
        },
      ],
    },
    preferencesForm: {
      class: 'cookie-preferences-form',
    },
    cookieManifest: [
      {
        categoryName: 'analytics',
        cookies: ['_ga', '_gid', '_gat'],
      },
      {
        categoryName: 'apm',
        cookies: ['dtCookie', 'dtLatC', 'dtPC', 'dtSa', 'rxVisitor', 'rxvt'],
      },
      {
        categoryName: 'essential',
        optional: false,
        matchBy: 'exact',
        cookies: ['_csrf', '__user-info'],
      },
    ],
  };

  init(): void {
    hmctsCookieManager.default.init(this.cookieManagerConfig);
  }
}
