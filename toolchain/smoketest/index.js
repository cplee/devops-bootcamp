'use strict';
var request = require('request');

const aws = require('aws-sdk');
const codedeploy = new aws.CodeDeploy({apiVersion: '2014-10-06'});

exports.handler = (event, context, callback) => {
    var resultParams = {
        deploymentId: event.DeploymentId,
        lifecycleEventHookExecutionId: event.LifecycleEventHookExecutionId
    };

    // perform smoke testing
    console.log(`Loading ${process.env.URL}`)
    request(process.env.URL, function (error, response, body) {
        if (error) {
            resultParams.status =  'Failed';
            console.error(`Error occured: ${error}`)
        } else if (response.statusCode != process.env.STATUS) {
            resultParams.status =  'Failed';
            console.error(`Unsuccessful HTTP status: ${response.statusCode} != ${process.env.STATUS}`)
        } else if (body.indexOf(process.env.BODY) == -1) {
            resultParams.status =  'Failed';
            console.error(`Body is missing '${process.env.BODY}'`)
        } else {
            resultParams.status =  'Succeeded';
        }
        codedeploy.putLifecycleEventHookExecutionStatus(resultParams, callback);
      });
};