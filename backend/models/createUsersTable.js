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
    TableName: 'Users',
    KeySchema: [
        { AttributeName: 'userId', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'username', AttributeType: 'S' },
      { AttributeName: 'email', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    GlobalSecondaryIndexes: [
      {
          IndexName: "UsernameIndex",
          KeySchema: [
              { AttributeName: "username", KeyType: "HASH" }
          ],
          Projection: {
              ProjectionType: "KEYS_ONLY"
          },
          ProvisionedThroughput: {
              ReadCapacityUnits: 5,
              WriteCapacityUnits: 5
          }
      },
      {
          IndexName: "EmailIndex",
          KeySchema: [
              { AttributeName: "email", KeyType: "HASH" }
          ],
          Projection: {
              ProjectionType: "KEYS_ONLY"
          },
          ProvisionedThroughput: {
              ReadCapacityUnits: 5,
              WriteCapacityUnits: 5
          }
      }
  ]
};

const run = async () => {
    try {
        const data = await dynamoDBClient.send(new CreateTableCommand(params));
        console.log("Users table created:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Unable to create Users table. Error:", JSON.stringify(err, null, 2));
    }
};

run();
