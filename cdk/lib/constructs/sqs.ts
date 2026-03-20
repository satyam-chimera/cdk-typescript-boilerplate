import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";

export class TaskQueue extends Construct {
  public readonly queue: sqs.Queue;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.queue = new sqs.Queue(this, "TaskQueue", {
      queueName: "task-queue",
    });
  }
}