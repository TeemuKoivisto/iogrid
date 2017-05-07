const path = require('path');
const SocketCluster = require('socketcluster').SocketCluster;
const scHotReboot = require('sc-hot-reboot');

class Server {
  constructor(env) {
    this.env = env;
    this.options = env.socker_cluster_options;
  }

  start() {
    const options = Object.assign({}, this.options, {
      workerController: path.join(__dirname, '/Worker.js'),
      brokerController: path.join(__dirname, '../services/Broker.js')
    })

    const socketCluster = new SocketCluster(options);

    // if (this.env.masterControllerPath) {
    //   var masterController = require(this.env.masterControllerPath);
    //   masterController.run(socketCluster);
    // }

    if (process.env.NODE_ENV = 'development') {
      // This will cause SC workers to reboot when code changes anywhere in the app directory.
      // The second options argument here is passed directly to chokidar.
      // See https://github.com/paulmillr/chokidar#api for details.
      const rootPath = path.join(__dirname, '../');
      console.log(`   !! The sc-hot-reboot plugin is watching for code changes in the ${rootPath} directory`);
      scHotReboot.attach(socketCluster, {
        cwd: rootPath,
        ignored: ['public', 'node_modules', 'README.md', 'Dockerfile', 'index.js', './server/Server.js', './services/Broker.js', /[\/\\]\./]
      });
    }
  }
}

module.exports = Server;