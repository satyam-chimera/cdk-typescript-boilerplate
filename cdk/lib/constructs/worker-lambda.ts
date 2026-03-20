import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as path from "path";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export interface WorkerLambdaProps {
  queue: sqs.Queue;
}

export class WorkerLambda extends Construct {
  public readonly lambdaFunction: lambda.Function;

  constructor(scope: Construct, id: string, props: WorkerLambdaProps) {
    super(scope, id);

    const workerEntry = path.join(
      __dirname,
      "../../../services/task-worker/handler.ts"
    );

    this.lambdaFunction = new NodejsFunction(this, "TaskWorkerLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: workerEntry,
      handler: "handler",
      bundling: {
        externalModules: [], // optional
      },
      environment: {
        QUEUE_NAME: props.queue.queueName,
      },
    });

    this.lambdaFunction.addEventSource(
      new lambdaEventSources.SqsEventSource(props.queue)
    );
  }
}