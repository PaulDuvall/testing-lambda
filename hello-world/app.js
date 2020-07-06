const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: process.env.REGION});
const htmlResponse = require('./html-response');

    console.log('1625 Running app.js');


    let scanningParameters = {
        TableName: process.env.TABLE_NAME,
        Limit: 100 //maximum result of 100 items
    };



docClient.scan(scanningParameters, onScan);
var count = 0;

function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {        
        console.log("Scan succeeded.");
        data.Items.forEach(function(itemdata) {
           console.log("Item :", ++count,JSON.stringify(itemdata));
        });
    }
}
    
const ddb = `
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
