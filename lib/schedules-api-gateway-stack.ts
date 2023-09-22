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

    const schedulesIntegration = new Apigateway.LambdaIntegration(props.schedulesHandler)

    // /schedules
    const schedulesResource = api.root.addResource("schedules")

    // GET /schedules
    schedulesResource.addMethod("GET", schedulesIntegration)

    // POST /schedules
    schedulesResource.addMethod("POST", schedulesIntegration)

    // /schedules/{id}
    const scheduleIdResource = schedulesResource.addResource("{id}")
   
    // GET /schedules/{id}
    scheduleIdResource.addMethod("GET", schedulesIntegration)

    // PUT /schedules/{id}
    scheduleIdResource.addMethod("PUT", schedulesIntegration)    
    
    // DELETE /schedules/{id}
    scheduleIdResource.addMethod("DELETE", schedulesIntegration)

  }
}