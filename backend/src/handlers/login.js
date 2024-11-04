"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const requestBody = JSON.parse(event.body);

  const params = {
    TableName: "users",
    Key: {
      username: requestBody.username,
    },
  };

  try {
    const data = await dynamoDb.get(params).promise();
    console.log(data);
    const cors_headers = {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    };

    if (!data.Item || data.Item.password !== requestBody.password) {
      return {
        statusCode: 401,
        headers: cors_headers,
        body: JSON.stringify({ message: "Invalid username or password" }),
      };
    }

    return {
      statusCode: 200,
      headers: cors_headers,
      body: JSON.stringify({ message: "Login successful" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: cors_headers,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
