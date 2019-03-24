'use strict';
const loadtest = require('loadtest');

const aws = require('aws-sdk');
const codedeploy = new aws.CodeDeploy({apiVersion: '2014-10-06'});

exports.handler = (event, context, callback) => {
    var resultParams = {
        deploymentId: event.DeploymentId,
        lifecycleEventHookExecutionId: event.LifecycleEventHookExecutionId,
        status: 'Succeeded'
    };
    codedeploy.putLifecycleEventHookExecutionStatus(resultParams, callback);

    const options = {
        url: process.env.URL,
        concurrency: process.env.CONCURRENCY,
        maxSeconds: process.env.MAX_SECONDS,
        requestsPerSecond: process.env.REQUESTS_PER_SECOND 
    };
     
    console.log(`Loading ${process.env.URL}`)
    loadtest.loadTest(options, function(error) {
        if (error) {
            console.error('Got an error: %s', error);
        } else {
            console.log('Tests run successfully');
        }
    });
};