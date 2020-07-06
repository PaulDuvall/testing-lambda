const htmlResponse = require('./html-response');
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
