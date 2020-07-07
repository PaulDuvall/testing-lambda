let response;
exports.lambdaHandler = async (event, context) => {
  try {
    console.log("Event 1202", event);
    console.log('Body:', event.body);
    console.log('Headers:', event.headers);
    console.log('Method:', event.method);
    console.log('Params:', event.params);
    console.log('Query:', event.query);
    response = {
      'statusCode': 200,
      'body': JSON.stringify({
        message: 'hello world 1202',
      })
    }
  } catch (err) {
    console.log(err);
    return err;
  }
  return response;
};
