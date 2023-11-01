const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const { dynamoDBDocClient } = require('../aws-config');

const docClient = dynamoDBDocClient;

const addUser = async (user) => {
  const params = {
      TableName: 'Users',
      Item: user
  };

  console.log("Inserting user into DynamoDB:", user); // Log the user data

  try {
      const data = await docClient.send(new PutCommand(params));
      console.log("User added to DynamoDB:", data); // Log the response from DynamoDB
      return data;
  } catch (err) {
      console.error('Error adding user:', err);
      throw err;
  }
};

module.exports = {
    addUser
};
