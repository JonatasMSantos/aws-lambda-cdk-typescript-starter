import * as cdk from "aws-cdk-lib"
import { Construct } from "constructs"
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"
import * as Apigateway from "aws-cdk-lib/aws-apigateway"

interface SchedulesApiGatewayProps extends cdk.StackProps {
  schedulesHandler: lambdaNodeJS.NodejsFunction
}

export class SchedulesApiGateway extends cdk.Stack {
  readonly schedulesHandler: lambdaNodeJS.NodejsFunction

  constructor(scope: Construct, id: string, props: SchedulesApiGatewayProps) {
    super(scope, id, props)

    const api = new Apigateway.RestApi(this, "SchedulesApi", {
      restApiName: "SchedulesAPI"
    })

    const schedulesRequestValidator = new Apigateway.RequestValidator(this, "SchedulesRequestValidator", {
      restApi: api,
      requestValidatorName: "Schedules request validator",
      validateRequestBody: true,
    })

    /**
      interface Schedule {
        id: string;
        title: string;
        description: string;
        dateTimeAlert: Date;
      }
    */

    const scheduleModel = new Apigateway.Model(this, "ScheduleModel", {
      modelName: "ScheduleModel", 
      restApi: api,
      contentType: "application/json",
      schema: {
        type: Apigateway.JsonSchemaType.OBJECT,
        properties: {
          title: {
            type: Apigateway.JsonSchemaType.STRING
          },
          description: {
            type: Apigateway.JsonSchemaType.STRING
          },
          dateTimeAlert: {
            type: Apigateway.JsonSchemaType.STRING
          }          
        },
        required: [
          "title",
          "dateTimeAlert"
        ]
      }
    })

    const schedulesIntegration = new Apigateway.LambdaIntegration(props.schedulesHandler)

    // /schedules
    const schedulesResource = api.root.addResource("schedules")

    // GET /schedules
    schedulesResource.addMethod("GET", schedulesIntegration)

    // POST /schedules
    schedulesResource.addMethod("POST", schedulesIntegration, {
      requestValidator: schedulesRequestValidator,
      requestModels: {
        "application/json": scheduleModel
      }
    })

    // /schedules/{id}
    const scheduleIdResource = schedulesResource.addResource("{id}")
   
    // GET /schedules/{id}
    scheduleIdResource.addMethod("GET", schedulesIntegration)

    // PUT /schedules/{id}
    scheduleIdResource.addMethod("PUT", schedulesIntegration, {
      requestValidator: schedulesRequestValidator,
      requestModels: {
        "application/json": scheduleModel
      }
    })    
    
    // DELETE /schedules/{id}
    scheduleIdResource.addMethod("DELETE", schedulesIntegration)

  }
}