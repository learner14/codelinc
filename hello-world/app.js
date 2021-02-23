// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
"use strict";
const AWS = require('aws-sdk');

const db = new AWS.DynamoDB.DocumentClient();
let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.lambdaHandler = async (event, context) => {
    try {
        // const ret = await axios(url);
        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: 'Greetings My world',
                // location: ret.data.trim()
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
};
exports.addName = async (event, context) => {
    let response;
    const name  = JSON.parse(event.body); // fetch name property from POST request body
    const id = Buffer.from(name).toString('base64'); // base64 name to get unique id

console.log('------Name='+name );
console.log('------id='+id );

    const params = {
        TableName: 'Names',
        Item: {
            id,
            name
        }
    };

    try {
        await db.put(params).promise();
        response = {
            statusCode: 201,
        };
    } catch (err) {
        response = {
            statusCode: 500,
            body: JSON.stringify({ message: err.message })
        };
    }

    return response;
}
exports.greetNames = async (event, context) => {
    let response;

    try {
        const names = (await db.scan({ TableName: 'Names' }).promise())
            .Items.map((item) => item.name);

        response = {
            statusCode: 200,
            body: JSON.stringify({ message: `hello ${names}` })
        };
    } catch (err) {
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: err.message,
            })
        }
    }

    return response;
}
