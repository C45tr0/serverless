'use strict';

const BbPromise = require('bluebird');

module.exports = {
  validate() {
    if (!this.serverless.config.servicePath) {
      throw new this.serverless.classes
        .Error('This command can only be run inside a service directory');
    }

    this.options.stage = this.options.stage
      || (this.serverless.service.defaults && this.serverless.service.defaults.stage)
      || '';
    this.options.region = this.options.region
      || (this.serverless.service.defaults && this.serverless.service.defaults.region)
      || 'us-east-1';
    this.options.gatewayAPI = this.options.gatewayAPI
      || (this.serverless.service.provider && this.serverless.service.provider.gatewayAPI)
      || {};

    return BbPromise.resolve();
  },
};
