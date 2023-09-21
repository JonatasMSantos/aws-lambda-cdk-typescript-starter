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

  // /products
  if (event.resource === "products") {
    if (method === "GET") {
      //recuperar todos produtos
      console.log("GET /products");

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "GET /products",
        }),
      };
    } else if (method === "POST") {
      //criar produto
      console.log("POST /products");

      return {
        statusCode: 201,
        body: JSON.stringify({
          message: "POST /products",
        }),
      };
    }
  } else if (event.resource === "products/{id}") {
    // /products/{id}
    const id = event.pathParameters!.id!;
    if (method === "GET") {
      // GET /products/{id}
      console.log(`GET /products/${id}`);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `GET /products/${id}`,
        }),
      };
    } else if (method === "PUT") {
      // GET /products/{id}
      console.log(`PUT /products/${id}`);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `PUT /products/${id}`,
        }),
      };
    } else if (method === "DELETE") {
      // GET /products/{id}
      console.log(`DELETE /products/${id}`);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `DELETE /products/${id}`,
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
