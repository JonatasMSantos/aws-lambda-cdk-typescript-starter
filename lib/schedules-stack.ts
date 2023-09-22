import * as cdk from "aws-cdk-lib"
import { Construct } from "constructs"

import * as lambda from "aws-cdk-lib/aws-lambda"
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"

export class SchedulesStack extends cdk.Stack {
  readonly schedulesHandler: lambdaNodeJS.NodejsFunction

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    this.schedulesHandler = new lambdaNodeJS.NodejsFunction(this, "SchedulesFunction", {
      functionName: "SchedulesFunction",
      entry: "lambda/schedulesFunction.ts",
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_18_X,
      memorySize: 256,
      timeout: cdk.Duration.seconds(5),
      bundling: {
        minify: true,
        sourceMap: false
      }
    })

  }
}