require('dotenv').config();
const { DynamoDBClient, CreateTableCommand } = require("@aws-sdk/client-dynamodb");

const dynamoDBClient = new DynamoDBClient({
    region: 'us-west-2',
    endpoint: 'http://localhost:8000',
    credentials: {
        accessKeyId: 'fakeAccessKeyId',
        secretAccessKey: 'fakeSecretAccessKey'
    }
});

const params = {
    TableName: 'TestConfigurations',
    KeySchema: [
        { AttributeName: 'configId', KeyType: 'HASH' },
        { AttributeName: 'userId', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
        { AttributeName: 'configId', AttributeType: 'S' },
        { AttributeName: 'userId', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};

const run = async () => {
  try {
      const data = await dynamoDBClient.send(new CreateTableCommand(params));
      console.log("TestConfigurations table created:", JSON.stringify(data, null, 2));
  } catch (err) {
      console.error("Unable to create TestConfigurations table. Error:", JSON.stringify(err, null, 2));
  }
};

run();
