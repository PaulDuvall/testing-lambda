const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: process.env.REGION});
const htmlResponse = require('./html-response');

    console.log('1552 Running app.js');


    let scanningParameters = {
        TableName: process.env.TABLE_NAME,
        // TableName: "makeitfail14",
        Limit: 100 //maximum result of 100 items
    };


    //In dynamoDB scan looks through your entire table and fetches all data
    docClient.scan(scanningParameters, function(err,data){
        if (err) {
            console.log(err, err.stack);
        }
        else{
        }
    });

const formHtml = `
  <html>
  <head>
    <meta charset="utf-8"/>
  </head>
  <body>
    <form method="POST">
      Please enter your name:
      <input type="text" name="name"/>
      <br/>
      <input type="submit" />
    </form>
  </body>
  </html>
`;

const thanksHtml = `
  <html>
  <head>
    <meta charset="utf-8"/>
  </head>
  <body>
    <h1>Thanks</h1>
    <p>We received your submission</p>
  </body>
  </html>
`;

exports.lambdaHandler = async (event, context) => {
  console.log(JSON.stringify(event, null, 2));

  if (event.httpMethod === 'GET') {
    return htmlResponse(formHtml);
  } else {
    return htmlResponse(thanksHtml);
  }
};
