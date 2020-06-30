const aws = require('aws-sdk');
const codedeploy = new aws.CodeDeploy();
const lambda = new aws.Lambda();

exports.lambdaHandler = async (event) => {
  let status = 'Failed';

  console.log("Entering PreTraffic.js Hook!");
  console.log(JSON.stringify(event));

  //Read the DeploymentId from the event payload.
  let deploymentId = event.DeploymentId;
  console.log("deploymentId=" + deploymentId);

  //Read the LifecycleEventHookExecutionId from the event payload
  let lifecycleEventHookExecutionId = event.LifecycleEventHookExecutionId;
  console.log("lifecycleEventHookExecutionId=" + lifecycleEventHookExecutionId);


  let invokeParams = {
    FunctionName: process.env.CurrentVersion
  }

  try{
    let returnEvent = await lambda.invoke(invokeParams).promise()
    console.log(returnEvent);
    console.log(JSON.parse(returnEvent.Payload))
    console.log("returnEvent.body=" + JSON.parse(returnEvent.body))
    console.log("returnEvent.statusCode=" + JSON.parse(returnEvent.statusCode))
    if(JSON.parse(returnEvent.Payload).preTest) status = 'Succeeded';
  } catch (err) {
    console.log('error invoking Lambda');
    console.log(err)
  }

  // Prepare the validation test results with the deploymentId and
  // the lifecycleEventHookExecutionId for AWS CodeDeploy.
  let params = {
    deploymentId: deploymentId,
    lifecycleEventHookExecutionId: lifecycleEventHookExecutionId,
    status: status // status can be 'Succeeded' or 'Failed'
  };

  try {
    await codedeploy.putLifecycleEventHookExecutionStatus(params).promise();
    console.log("putLifecycleEventHookExecutionStatus done. executionStatus=[" + params.status + "]");
    return 'Validation test succeeded'
  } catch (err) {
    console.log("putLifecycleEventHookExecutionStatus ERROR: " + err);
    throw new Error('Validation test failed')
  }
}