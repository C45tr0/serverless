'use strict';

const BbPromise = require('bluebird');

module.exports = {
  remove() {
    var s = this.options.stage;
    if (s) {
      s = "-" + s;
    }

    this.serverless.cli.log('Removing Stack...');
    const stackName = `${this.serverless.service.service}${s}`;
    const params = {
      StackName: stackName,
    };
    const cfData = {
      StackId: stackName,
    };

    return this.sdk.request('CloudFormation',
      'deleteStack',
      params,
      this.options.stage,
      this.options.region)
      .then(() => cfData);
  },

  removeStack() {
    return BbPromise.bind(this)
      .then(this.remove);
  },
};
