import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const method = event.httpMethod;
  const apiRequestId = event.requestContext.requestId;
  const lambdaRequestId = context.awsRequestId;

  console.log(
    `API Gateway RequestId: ${apiRequestId} - Lambda RequestId: ${lambdaRequestId}`
  );

  // /schedules
  if (event.resource === "/schedules") {
    if (method === "GET") {
      //get all schedules
      console.log("GET /schedules");

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "GET /schedules",
        }),
      };
    } else if (method === "POST") {
      //create schedule
      console.log("POST /schedules");

      return {
        statusCode: 201,
        body: JSON.stringify({
          message: "POST /schedules",
        }),
      };
    }
  } else if (event.resource === "/schedules/{id}") {
    // /schedules/{id}
    const id = event.pathParameters!.id!;
    if (method === "GET") {
      // GET /schedules/{id}
      console.log(`GET /schedules/${id}`);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `GET /schedules/${id}`,
        }),
      };
    } else if (method === "PUT") {
      // GET /schedules/{id}
      console.log(`PUT /schedules/${id}`);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `PUT /schedules/${id}`,
        }),
      };
    } else if (method === "DELETE") {
      // GET /schedules/{id}
      console.log(`DELETE /schedules/${id}`);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `DELETE /schedules/${id}`,
        }),
      };
    }
  }

  return {
    statusCode: 400,
    headers: {},
    body: JSON.stringify({
      message: "Bad request",
    }),
  };
}
