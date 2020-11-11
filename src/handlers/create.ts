import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

import 'source-map-support/register';
import { Product } from '../models/product';

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  let product: Product;

  // Parse data from the request
  try {
    product = JSON.parse(event.body);
  } catch (jsonError) {
    console.log('There was an error parsing json');
    console.log(jsonError);

    return {
      statusCode: 400,
      body: JSON.stringify({
        status: 'fail',
        error: 'There was an error parsing the body',
      }),
    };
  }

  console.log('Logging product from parsed body', product);

  // Check for required attributes
  if (
    !product.name ||
    !product.summary ||
    !product.description ||
    product.category
  ) {
    console.log('Missing Parameters');
    return {
      statusCode: 400,
      body: JSON.stringify({
        status: 'fail',
        error: 'Missing name or summary or description or category',
      }),
    };
  }

  let putParams = {
    TableName: process.env.DYNAMODB_PRODUCT_TABLE,
    Item: {
      ...product,
    },
  };

  let putResult = {};

  // Save the product
  try {
    let dynamoDB = new DynamoDB.DocumentClient();
    putResult = await dynamoDB.put(putParams).promise();
  } catch (putError) {
    console.log('There was an error saving the product');
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: 'fail',
        error: 'Error saving the product',
      }),
    };
  }

  // Return successful response
  return {
    statusCode: 201,
    body: JSON.stringify({
      status: 'Created',
    }),
  };
};
