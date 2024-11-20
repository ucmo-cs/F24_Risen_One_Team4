"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const corsHeaders = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
};

// Helper function to check if a user exists
const checkUserExists = async (username) => {
  const params = {
    TableName: "timesheet",
    Key: { username },
  };
  const data = await dynamoDb.get(params).promise();
  return data.Item !== undefined;
};

// Create or Update Timesheet
module.exports.createOrUpdateTimesheet = async (event) => {
  const requestBody = JSON.parse(event.body);
  const {
    username,
    projectName,
    selectMonth,
    employeesList,
    date,
    managerSignature,
  } = requestBody;

  const params = {
    TableName: "timesheet",
    Item: {
      username,
      data: {
        projectName,
        selectMonth,
        employeesList, // List of employees each with a list of 31 integers
        date,
        managerSignature,
      },
    },
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Timesheet saved successfully" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

// Get Timesheet by Username
module.exports.getTimesheet = async (event) => {
  const { username } = event.pathParameters;

  const params = {
    TableName: "timesheet",
    Key: { username },
  };

  try {
    const data = await dynamoDb.get(params).promise();
    if (!data.Item) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Timesheet not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(data.Item),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

// Check if User Exists
module.exports.checkUserExists = async (event) => {
  const { username } = event.pathParameters;

  try {
    const userExists = await checkUserExists(username);

    return {
      statusCode: userExists ? 200 : 404,
      headers: corsHeaders,
      body: JSON.stringify({
        message: userExists ? "User exists" : "User not found",
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
