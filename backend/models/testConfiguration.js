const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const dynamoDBClient = require('../aws-config');

const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

const addTestConfiguration = async (config) => {
    const params = {
        TableName: 'TestConfigurations',
        Item: config
    };

    try {
        const data = await docClient.send(new PutCommand(params));
        return data;
    } catch (err) {
        console.error('Error adding test configuration:', err);
        throw err;
    }
};

module.exports = {
    addTestConfiguration
};
