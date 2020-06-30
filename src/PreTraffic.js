// @ts-check
'use strict';

const aws = require('aws-sdk');
const codedeploy = new aws.CodeDeploy({apiVersion: '2014-10-06'});
var lambda = new aws.Lambda();


exports.handler = async (event, context, callback) => {

    console.log("Entering PreTraffic Hook!");
    console.log(JSON.stringify(event));

    //Read the DeploymentId from the event payload.
    let deploymentId = event.DeploymentId;
    console.log("deploymentId=" + deploymentId);

    //Read the LifecycleEventHookExecutionId from the event payload
    let lifecycleEventHookExecutionId = event.LifecycleEventHookExecutionId;
    console.log("lifecycleEventHookExecutionId=" + lifecycleEventHookExecutionId);

    var functionToTest = process.env.CurrentVersion;
    console.log("Testing new function version: " + functionToTest);

    // Perform validation of the newly deployed Lambda version
    var lambdaParams = {
        FunctionName: functionToTest,
        InvocationType: "RequestResponse"
    };

    var lambdaResult = "Failed";
    lambda.invoke(lambdaParams, function (err, data) {
        if (err) {	// an error occurred
            console.log(err, err.stack);
            lambdaResult = "Failed";
        }
        else {	// successful response
            var result = JSON.parse(data.Payload);
            console.log("Result: " + JSON.stringify(result));

            // Check the response for valid results
            // The response will be a JSON payload with statusCode and body properties. ie:
            // {
            //		"statusCode": 200,
            //		"body": 51
            // }
            if (result.body == 1) {
                lambdaResult = "Succeeded";
                console.log("Validation testing succeeded!");
            }
            else {
                lambdaResult = "Failed";
                console.log("Validation testing failed!");
            }

            // Complete the PreTraffic Hook by sending CodeDeploy the validation status
            var params = {
                deploymentId: deploymentId,
                lifecycleEventHookExecutionId: lifecycleEventHookExecutionId,
                status: lambdaResult // status can be 'Succeeded' or 'Failed'
            };
            
            console.log("lambdaResult=" + lambdaResult);
            try {
              codedeploy.putLifecycleEventHookExecutionStatus(params).promise();
              console.log("putLifecycleEventHookExecutionStatus done. executionStatus=[" + params.status + "]");
              return 'Validation test succeeded'
            }
            catch (err) {
              console.log("putLifecycleEventHookExecutionStatus ERROR: " + err);
              throw new Error('Validation test failed')
            }
        }
        
    });
}