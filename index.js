
// Will load environment variables from .env file.
require('dotenv').config();

const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const EnvLoader = require('./services/EnvLoader');

const env = EnvLoader.load(argv);
const ServerClass = require('./server/Server');
const Server = new ServerClass(env);

/**
 * Will not start the server if this module hasn't been loaded directly with 'node index.js'.
 * Very useful for testing when starting up the cluster isn't preferred.
 */
if (!module.parent) {
  if (env.workerControllerPath) {
    // Detect when Docker volumes are ready.
    var startWhenFileIsReady = (filePath) => {
      return new Promise((resolve) => {
        if (!filePath) {
          resolve();
          return;
        }
        var checkIsReady = () => {
          fs.exists(filePath, (exists) => {
            if (exists) {
              resolve();
            } else {
              setTimeout(checkIsReady, env.bootCheckInterval);
            }
          });
        };
        checkIsReady();
      });
    };
    var filesReadyPromises = [
      startWhenFileIsReady(env.masterControllerPath),
      startWhenFileIsReady(env.workerControllerPath),
      startWhenFileIsReady(env.brokerControllerPath),
      startWhenFileIsReady(env.initControllerPath)
    ];
    Promise.all(filesReadyPromises).then(() => {
      Server.start();
    });
  } else {
    Server.start();
  }

  process.on('exit', () => {
    // TODO add terminations for Server and Worker here
    process.exit();
  });
}

module.exports = Server;