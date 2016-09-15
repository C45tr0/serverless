'use strict';

const _ = require('lodash');
const BbPromise = require('bluebird');

module.exports = {
  compileRestApi() {
    var s = this.options.stage;
    if (s) {
      s = s + "-";
    }

    const restApiTemplate = `
      {
        "Type" : "AWS::ApiGateway::RestApi",
        "Properties" : {
          "Name" : "${s}${this.serverless.service.service}"
        }
      }
    `;

    const newRestApiObject = {
      ApiGatewayRestApi: JSON.parse(restApiTemplate),
    };

    _.merge(this.serverless.service.provider.compiledCloudFormationTemplate.Resources,
      newRestApiObject);

    return BbPromise.resolve();
  },
};
