import { helloWorld, tomorrow } from "library";
import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';

export async function lambdaHandler (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);
 
  return {
      statusCode: 200,
      body: JSON.stringify({
          message: `${helloWorld()}, tomorrow will be ${tomorrow()}`,
      }),
  };
};

export function d (event: APIGatewayEvent, context: Context): APIGatewayProxyResult {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  return {
      statusCode: 200,
      body: JSON.stringify({
          message: 'hello world',
      }),
  };
};
