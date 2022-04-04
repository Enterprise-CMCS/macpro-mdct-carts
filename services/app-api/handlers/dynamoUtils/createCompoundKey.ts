import { APIGatewayProxyEvent } from 'aws-lambda'; // eslint-disable-line no-unused-vars

export const createCompoundKey = (event: APIGatewayProxyEvent) => {
  if (!event.pathParameters) throw new Error('No Path Parameters Object');
  if (!event.pathParameters.state || !event.pathParameters.year || !event.pathParameters.measure)
    throw new Error(
      'Be sure to include year, measure, and state in the path' + event.pathParameters
    );

  const state = event.pathParameters.state;
  const year = event.pathParameters.year;
  const measure = event.pathParameters.measure;

  return `${state}${year}${measure}`;
};
