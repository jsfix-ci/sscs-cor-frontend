import * as AppInsights from './app-insights';
const { Express } = require('@hmcts/nodejs-logging');
import { RequestHandler } from 'express';
import express = require('express');
import { router as routes } from './routes';
const errors = require('./middleware/error-handler');
import * as health from './middleware/health';
const locale = require('../../locale/en.json');
import * as Paths from './paths';
const bodyParser = require('body-parser');
import * as cookieParser from 'cookie-parser';
const { fileTypes } = require('./utils/mimeTypeWhitelist');
import * as screenReaderUtils from './utils/screenReaderUtils';
import { configureHelmet, configureHeaders, configureNunjucks } from './app-configurations';
import watch from './watch';
import * as config from 'config';
import { isFeatureEnabled, Feature } from './utils/featureEnabled';
import { csrfToken, csrfTokenEmbed } from './middleware/csrf';
const healthCheck = require('@hmcts/nodejs-healthcheck');

const isDevelopment = process.env.NODE_ENV === 'development';

interface Options {
  disableAppInsights ?: boolean;
}

function setup(sessionHandler: RequestHandler, options: Options) {
  const opts = options || {};
  if (!opts.disableAppInsights) {
    AppInsights.enable();
  }

  const app: express.Application = express();

  if (!isDevelopment) {
    // Protect against some well known web vulnerabilities
    configureHelmet(app);
  }
  configureHeaders(app);

  app.set('view engine', 'html');
  app.locals.i18n = locale;
  app.locals.fileTypeWhiteList = fileTypes;
  app.locals.screenReaderUtils = screenReaderUtils;

  if (!isDevelopment) {
    app.set('trust proxy', 1);
  } else {
    watch(app);
    app.locals.isDev = true;
  }

  configureNunjucks(app);

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  // Get Base url and contact us configuration
  app.use((req, res, next) => {
    app.locals.webChat = config.get('services.webChat');
    app.locals.webFormUrl = config.get('services.webForm.url');
    app.locals.allowContactUs = isFeatureEnabled(Feature.ALLOW_CONTACT_US, req.cookies);
    app.locals.contactUsWebFormEnabled = isFeatureEnabled(Feature.CONTACT_US_WEB_FORM_ENABLED, req.cookies);
    app.locals.contactUsTelephoneEnabled = isFeatureEnabled(Feature.CONTACT_US_TELEPHONE_ENABLED, req.cookies);
    app.locals.webChatEnabled = isFeatureEnabled(Feature.CONTACT_US_WEBCHAT_ENABLED, req.cookies);
    app.locals.baseUrl = `${req.protocol}://${req.headers.host}`;
    next();
  });
  app.use('/public', express.static(`${__dirname}/../../public`));
  app.use(Express.accessLogger());
  app.use(sessionHandler);
  app.use(csrfToken);
  app.use(csrfTokenEmbed);
  app.use(Paths.health, health.getHealthConfigure());
  app.use(Paths.readiness, health.getReadinessConfigure());
  app.use(errors.sessionNotFoundHandler);
  app.use(routes);
  app.use(errors.pageNotFoundHandler);
  app.use(errors.coreErrorHandler);
  return app;
}

export { setup };
