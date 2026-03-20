import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { TasksTable } from "./constructs/dynamodb";
import { TaskLambdas } from "./constructs/lambdas";
import { TaskApiGateway } from "./constructs/api-gateway";
import { TaskEvents } from "./constructs/sns";
import { TaskQueue } from "./constructs/sqs"; 
import { WorkerLambda } from "./constructs/worker-lambda";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new TasksTable(this, "TasksTable");
    const lambdas = new TaskLambdas(this, "TaskLambdas");

    // SNS
    const events = new TaskEvents(this, "TaskEvents");

    // 🆕 SQS
    const queue = new TaskQueue(this, "TaskQueue");
   const worker = new WorkerLambda(this, "TaskWorker", { queue: queue.queue });
    // 🔥 CONNECT SNS → SQS
    events.addQueueSubscription(queue.queue);

    // DynamoDB permissions
    table.table.grantReadWriteData(lambdas.createTaskLambda);
    table.table.grantReadWriteData(lambdas.getTaskLambda);
    table.table.grantReadWriteData(lambdas.updateTaskLambda);
    table.table.grantReadWriteData(lambdas.deleteTaskLambda);

    // SNS publish permission
    events.topic.grantPublish(lambdas.createTaskLambda);

    // Pass Topic ARN
    lambdas.createTaskLambda.addEnvironment(
      "TASK_TOPIC_ARN",
      events.topic.topicArn
    );

    new TaskApiGateway(this, "TaskApiGateway", lambdas);
  }
}