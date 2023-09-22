#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

import { SchedulesApiGateway } from "../lib/schedules-api-gateway-stack";
import { SchedulesStack } from "../lib/schedules-stack";

const app = new cdk.App();

const env: cdk.Environment= {
  region: 'us-east-2',
  account: '422025413855'
}

const tags = {
  cost: "SchedulesApp",
  team: "Reporte.me"
}

const scheduleStack = new SchedulesStack(app, "SchedulesApp", {
  env: env,
  tags: tags
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */
  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});

const scheduleApiStack = new SchedulesApiGateway(app, "Api", {
  env: env,
  tags: tags,
  schedulesHandler: scheduleStack.schedulesHandler
})

scheduleApiStack.addDependency(scheduleStack)
