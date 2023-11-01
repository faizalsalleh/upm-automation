require('dotenv').config();
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

let config = {
    region: 'us-west-2' // or your preferred region
};

if (process.env.NODE_ENV === 'development') {
    config.endpoint = 'http://localhost:8000';
    config.credentials = {
        accessKeyId: 'fakeAccessKeyId', // These are dummy values for local development
        secretAccessKey: 'fakeSecretAccessKey'
    };
}

const dynamoDBClient = new DynamoDBClient(config);
const dynamoDBDocClient = DynamoDBDocumentClient.from(dynamoDBClient);

module.exports = {
    dynamoDBClient,
    dynamoDBDocClient
};
