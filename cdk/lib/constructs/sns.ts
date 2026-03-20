import { Construct } from "constructs";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subscriptions from "aws-cdk-lib/aws-sns-subscriptions";
import * as sqs from "aws-cdk-lib/aws-sqs";

export class TaskEvents extends Construct {
  public readonly topic: sns.Topic;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.topic = new sns.Topic(this, "TaskTopic", {
      topicName: "task-events",
    });
  }

  // 🔥 NEW: method to attach SQS
  addQueueSubscription(queue: sqs.Queue) {
    this.topic.addSubscription(
      new subscriptions.SqsSubscription(queue)
    );
  }
}