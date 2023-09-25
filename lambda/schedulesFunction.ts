import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

import { DynamoDB } from "aws-sdk";
import { v4 as uuid } from "uuid";
import * as AWSXRay from "aws-xray-sdk"

AWSXRay.captureAWS(require('aws-sdk'))

const scheduleDbName = process.env.SCHEDULES_DB!;
const dbClient = new DynamoDB.DocumentClient();

interface Schedule {
  id: string;
  title: string;
  description: string;
  dateTimeAlert: Date;
}

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

      const schedules = await getAllSchedules();
      return {
        statusCode: 200,
        body: JSON.stringify({ schedules }),
      };
    } else if (method === "POST") {
      //create schedule
      console.log("POST /schedules");

      const schedule = JSON.parse(event.body!) as Schedule;
      const scheduleCreated = await createSchedule(schedule);

      return {
        statusCode: 201,
        body: JSON.stringify(scheduleCreated),
      };
    }
  } else if (event.resource === "/schedules/{id}") {
    // /schedules/{id}
    const id = event.pathParameters!.id!;
    if (method === "GET") {
      // GET /schedules/{id}
      console.log(`GET /schedules/${id}`);

      try {
        const schedule = await getScheduleById(id);
        return {
          statusCode: 200,
          body: JSON.stringify(schedule),
        };
      } catch (error) {
        console.error((<Error>error).message);
        return {
          statusCode: 404,
          body: (<Error>error).message,
        };
      }
    } else if (method === "PUT") {
      // PUT /schedules/{id}
      console.log(`PUT /schedules/${id}`);
      try {
        const schedule = JSON.parse(event.body!) as Schedule;
        const scheduleUpdated = await updateSchedule(id, schedule);

        return {
          statusCode: 200,
          body: JSON.stringify(scheduleUpdated),
        };
        //} catch (ConditionalCheckFailedException) {
      } catch (error) {
        console.error((<Error>error).message);
        return {
          statusCode: 404,
          body: (<Error>error).message,
        };
      }
    } else if (method === "DELETE") {
      // GET /schedules/{id}
      console.log(`DELETE /schedules/${id}`);

      try {
        const schedule = await deleteSchedule(id);
        return {
          statusCode: 200,
          body: JSON.stringify(schedule),
        };
      } catch (error) {
        console.error((<Error>error).message);
        return {
          statusCode: 404,
          body: (<Error>error).message,
        };
      }
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

//in production create indexes, pagination and filters
async function getAllSchedules(): Promise<Schedule[]> {
  const data = await dbClient
    .scan({
      TableName: scheduleDbName,
    })
    .promise();

  return data.Items as Schedule[];
}

//in production create indexes, pagination and filters
async function getScheduleById(scheduleId: string): Promise<Schedule> {
  const data = await dbClient
    .get({
      TableName: scheduleDbName,
      Key: {
        id: scheduleId,
      },
    })
    .promise();

  if (data.Item) {
    return data.Item as Schedule;
  } else {
    throw new Error("Schedule not found");
  }
}

//in production create indexes, pagination and filters
async function createSchedule(schedule: Schedule): Promise<Schedule> {
  schedule.id = uuid();
  await dbClient
    .put({
      TableName: scheduleDbName,
      Item: schedule,
    })
    .promise();

  return schedule;
}

//in production create indexes, pagination and filters
async function deleteSchedule(id: string): Promise<Schedule> {
  const data = await dbClient
    .delete({
      TableName: scheduleDbName,
      Key: {
        id: id,
      },
      ReturnValues: "ALL_OLD",
    })
    .promise();

  if (data.Attributes) {
    return data.Attributes as Schedule;
  } else {
    throw new Error("Schedule not found");
  }
}

async function updateSchedule(
  id: string,
  schedule: Schedule
): Promise<Schedule> {
  const data = await dbClient
    .update({
      TableName: scheduleDbName,
      Key: {
        id: id,
      },
      ConditionExpression: "attribute_exists(id)",
      UpdateExpression: "set title = :t, description = :d, dateTimeAlert = :ti",
      ExpressionAttributeValues: {
        ":t": schedule.title,
        ":d": schedule.description,
        ":ti": schedule.dateTimeAlert,
      },
      ReturnValues: "UPDATED_NEW",
    })
    .promise();

  data.Attributes!.id = id;
  return data.Attributes as Schedule;
}
