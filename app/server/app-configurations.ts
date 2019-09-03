const helmet = require('helmet');
import { CONST } from '../constants';
import nunjucks = require('nunjucks');
const dateFilter = require('nunjucks-date-filter');
import * as moment from 'moment';
import express = require('express');
const locale = require('../../locale/en.json');
const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('app-configuration.ts');

function configureHelmet(app) {

  // by setting HTTP headers appropriately.
  app.use(helmet());

  // Helmet referrer policy
  app.use(helmet.referrerPolicy({ policy: 'origin' }));

  // Helmet content security policy (CSP) to allow only assets from same domain.
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ['\'self\''],
      fontSrc: ['\'self\' data:'],
      scriptSrc: [
        '\'self\'',
        '\'unsafe-inline\'',
        'www.google-analytics.com',
        'www.googletagmanager.com',
        'tagmanager.google.com',
        'vcc-eu4.8x8.com'
      ],
      styleSrc: [
        '\'self\'',
        'tagmanager.google.com',
        'fonts.googleapis.com/'
      ],
      connectSrc: ['\'self\'', 'www.gov.uk', '//localhost:9856/'],
      mediaSrc: ['\'self\''],
      frameSrc: [
        '\'self\'',
        'www.googletagmanager.com',
        'vcc-eu4.8x8.com'
      ],
      frameAncestors: [
        '\'self\'',
        'www.googletagmanager.com'
      ],
      imgSrc: [
        '\'self\'',
        '\'self\' data:',
        'www.google-analytics.com',
        'www.googletagmanager.com',
        'tagmanager.google.com',
        'vcc-eu4.8x8.com'
      ]
    }
  }));
}

function configureHeaders(app) {
  // Disallow search index indexing
  app.use((req, res, next) => {
    // Setting headers stops pages being indexed even if indexed pages link to them
    res.setHeader('X-Robots-Tag', 'noindex');
    next();
  });
}

function configureNunjucks(app: express.Application) {

  const nunEnv = nunjucks.configure([
    'views',
    'node_modules/govuk-frontend/',
    'node_modules/govuk-frontend/components/'
  ], {
    autoescape: true,
    express: app,
    noCache:  true
  });
  nunEnv.addFilter('date', function (text) {
    if (!text) return '';
    const isoDateRegex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)/g;
    return text.replace(isoDateRegex, (date) => moment.utc(date).format(CONST.DATE_FORMAT));
  });
  nunEnv.addFilter('eval', function (text) {
    try {
      if (Array.isArray(text)) {
        text = text.join(' ');
      }
      return nunjucks.renderString(text, this.ctx);
    } catch (error) {
      logger.error(`Error rendering text eval: ${JSON.stringify(error)} : ${text}`);
      return 'Error redering text';
    }

  });

  nunEnv.addFilter('isArray', function(input) {
    return Array.isArray(input);
  });
  nunEnv.addFilter('dateFilter', dateFilter);
  nunEnv.addFilter('agencyAcronym', benefitType => {
    return nunjucks.renderString(locale.benefitTypes[benefitType].agencyAcronym, this.ctx);
  });
  nunEnv.addFilter('benefitAcronym', benefitType => {
    return nunjucks.renderString(locale.benefitTypes[benefitType].acronym, this.ctx);
  });
  nunEnv.addFilter('panel', benefitType => {
    return nunjucks.renderString(locale.benefitTypes[benefitType].panel, this.ctx);
  });

  nunEnv.addFilter('dateForDecisionReceived', utcDateTimeStr => {
    const howManyDaysAfterHearing = 5;
    return moment(utcDateTimeStr)
      .add(howManyDaysAfterHearing, 'days')
      .format('DD MMMM YYYY');
  });
}

export { configureHelmet, configureHeaders, configureNunjucks };
