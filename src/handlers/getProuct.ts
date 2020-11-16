import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

import 'source-map-support/register';

const dynamoClient = new DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  let product;
  const { id } = event.pathParameters;

  try {
    const result = await dynamoClient
      .get({
        TableName: process.env.DYNAMODB_PRODUCT_TABLE,
        Key: { id },
      })
      .promise();

    product = result.Item;
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: 'error',
        error,
      }),
    };
  }

  if (!product) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        status: 'fail',
        error: `Cannot find product with ID ${id}`,
      }),
    };
  }

  // Return successful response
  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'Success',
      product,
    }),
  };
};
