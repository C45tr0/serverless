'use strict';

const _ = require('lodash');
const BbPromise = require('bluebird');

module.exports = {
  compileDeployment() {
    var s = this.options.gatewayAPI.stage || this.options.stage || 'dev';
    const deploymentTemplate = `
      {
        "Type" : "AWS::ApiGateway::Deployment",
        "Properties" : {
          "RestApiId" : { "Ref": "ApiGatewayRestApi" },
          "StageName" : "${s}"
        }
      }
    `;

    this.apiGateWayDeploymentLogicalId = `ApiGatewayDeployment${(new Date()).getTime().toString()}`;
    const deploymentTemplateJson = JSON.parse(deploymentTemplate);
    deploymentTemplateJson.DependsOn = this.methodDependencies;

    const newDeploymentObject = {
      [this.apiGateWayDeploymentLogicalId]: deploymentTemplateJson,
    };

    _.merge(this.serverless.service.provider.compiledCloudFormationTemplate.Resources,
      newDeploymentObject);

    // create CLF Output for endpoint
    const outputServiceEndpointTemplate = `
    {
      "Description": "URL of the service endpoint",
      "Value": { "Fn::Join" : [ "", [ "https://", { "Ref": "ApiGatewayRestApi" },
        ".execute-api.${this.options.region}.amazonaws.com/${s}"] ] }
    }`;

    const newOutputEndpointObject = {
      ServiceEndpoint: JSON.parse(outputServiceEndpointTemplate),
    };

    _.merge(this.serverless.service.provider.compiledCloudFormationTemplate.Outputs,
      newOutputEndpointObject);

    return BbPromise.resolve();
  },
};
