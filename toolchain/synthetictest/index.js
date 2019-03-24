'use strict';

const aws = require('aws-sdk');
const codedeploy = new aws.CodeDeploy({apiVersion: '2014-10-06'});

exports.handler = (event, context, callback) => {
    var resultParams = {
        deploymentId: event.DeploymentId,
        lifecycleEventHookExecutionId: event.LifecycleEventHookExecutionId
    };

    // perform smoke testing
    request(process.env.ENDPOINT, function (error, response, body) {
        if (error) {
            resultParams.status =  'Failed';
            console.console.error(`Error occured: ${e}`)
        } else if (response.statusCode != 200) {
            resultParams.status =  'Failed';
            console.console.error(`Unsuccessful HTTP status: ${response.statusCode}`)
        } else if (body.indexOf("![Liatrio](img/Liatrio-icon.png)") == -1) {
            resultParams.status =  'Failed';
            console.console.error(`Body is missing logo`)
        } else {
            resultParams.status =  'Succeeded';
        }
        codedeploy.putLifecycleEventHookExecutionStatus(params, callback);
      });
};