const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const dynamoDBClient = require('../aws-config');

const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

const addTestResult = async (result) => {
    const params = {
        TableName: 'TestResults',
        Item: result
    };

    try {
        const data = await docClient.send(new PutCommand(params));
        return data;
    } catch (err) {
        console.error('Error adding test result:', err);
        throw err;
    }
};

module.exports = {
    addTestResult
};
