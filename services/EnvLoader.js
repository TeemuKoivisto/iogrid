
const EnvLoader = {
  load(argv) {
    const env = {
      workerControllerPath: argv.wc || process.env.SOCKETCLUSTER_WORKER_CONTROLLER,
      brokerControllerPath: argv.bc || process.env.SOCKETCLUSTER_BROKER_CONTROLLER,
      initControllerPath: argv.ic || process.env.SOCKETCLUSTER_INIT_CONTROLLER,
      environment: process.env.NODE_ENV || 'development',
      masterControllerPath: argv.mc || process.env.SOCKETCLUSTER_MASTER_CONTROLLER,
      bootCheckInterval: Number(process.env.SOCKETCLUSTER_BOOT_CHECK_INTERVAL) || 200
    }

    const socket_cluster_server_options = {
      workers: Number(argv.w) || Number(process.env.SOCKETCLUSTER_WORKERS) || 1,
      brokers: Number(argv.b) || Number(process.env.SOCKETCLUSTER_BROKERS) || 1,
      port: Number(argv.p) || Number(process.env.SOCKETCLUSTER_PORT) || Number(process.env.PORT) || 8000,
      // If your system doesn't support 'uws', you can switch to 'ws' (which is slower but works on older systems).
      wsEngine: process.env.SOCKETCLUSTER_WS_ENGINE || 'uws',
      appName: argv.n || process.env.SOCKETCLUSTER_APP_NAME || null,
      workerController: env.workerControllerPath || null,
      brokerController: env.brokerControllerPath || null,
      initController: env.initControllerPath || null,
      socketChannelLimit: Number(process.env.SOCKETCLUSTER_SOCKET_CHANNEL_LIMIT) || 1000,
      clusterStateServerHost: argv.cssh || process.env.SCC_STATE_SERVER_HOST || null,
      clusterStateServerPort: process.env.SCC_STATE_SERVER_PORT || null,
      clusterAuthKey: process.env.SCC_AUTH_KEY || null,
      clusterStateServerConnectTimeout: Number(process.env.SCC_STATE_SERVER_CONNECT_TIMEOUT) || null,
      clusterStateServerAckTimeout: Number(process.env.SCC_STATE_SERVER_ACK_TIMEOUT) || null,
      clusterStateServerReconnectRandomness: Number(process.env.SCC_STATE_SERVER_RECONNECT_RANDOMNESS) || null,
      crashWorkerOnError: argv['auto-reboot'] != false,
      // If using nodemon, set this to true, and make sure that environment is 'dev'.
      killMasterOnSignal: false,
      instanceId: 'realm-1',
      pubSubBatchDuration: null,
    }

    var SOCKETCLUSTER_OPTIONS;

    if (process.env.SOCKETCLUSTER_OPTIONS) {
      SOCKETCLUSTER_OPTIONS = JSON.parse(process.env.SOCKETCLUSTER_OPTIONS);
    }

    for (var i in SOCKETCLUSTER_OPTIONS) {
      if (SOCKETCLUSTER_OPTIONS.hasOwnProperty(i)) {
        socker_cluster_server_options[i] = SOCKETCLUSTER_OPTIONS[i];
      }
    }

    env.socket_cluster_server_options = socket_cluster_server_options;

    return env;
  }
}

module.exports = EnvLoader;