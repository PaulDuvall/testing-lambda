'use strict';

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

exports.handler = (event, context, callback) => {
    console.log("I am here! " + context.functionName + ":" + context.functionVersion);

    s3.listBuckets(function (err, data) {
        if (err) {
            console.log(err, err.stack);
            callback(null, {
                statusCode: 500,
                body: "Failed!"
            });
        }
        else {
            var allBuckets = data.Buckets;

            console.log("Total buckets: " + allBuckets.length);
            //callback(null, allBuckets.length);

            //  New Code begins here
            var counter = 0;
            for (var i in allBuckets) {
                if (allBuckets[i].Name[0] === "b")
                    counter++;
            }
            console.log("Total buckets starting with b: " + counter);

            callback(null, {
                statusCode: 200,
                body: counter
            });

        }
    });
}