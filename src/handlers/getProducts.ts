import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

import 'source-map-support/register';

const dynamoClient = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  let products;

  try {
    const result = await dynamoClient
      .scan({
        TableName: process.env.DYNAMODB_PRODUCT_TABLE,
      })
      .promise();

    products = result.Items;
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: 'error',
        error,
      }),
    };
  }

  // Return successful response
  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'Success',
      products,
    }),
  };
};
