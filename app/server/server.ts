import * as config from 'config';
import * as propertiesVolume from '@hmcts/properties-volume';
import { setupKeyVaultSecrets } from './services/setupSecrets';

propertiesVolume.addTo(config);

// Setup secrets before loading the app
setupKeyVaultSecrets();

const { Logger } = require('@hmcts/nodejs-logging');
import { setup } from './app';
import { createSession } from './middleware/session';

const logger = Logger.getLogger('server.js');

const port = config.get('node.port');

const redis = require('redis');
const session = require('express-session');
let RedisStore = require('connect-redis')(session);

let redisClient = redis.createClient({});
redisClient.unref();
redisClient.on('error', (error: Error) => logger.error(`Redis Error: ${error.message}`));

let store = new RedisStore({
  client: redisClient,
  url: config.get('session.redis.url'),
  ttl: config.get('session.redis.ttlInSeconds')
});

const app = setup(createSession(store), {});

const server = app.listen(port, () => logger.info(`Server  listening on port ${port}`))
  .on('error', (error: Error) => logger.error(`Unable to start server because of ${error.message}`));

export default server;
