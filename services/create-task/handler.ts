import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { v4 as uuidv4 } from "uuid";

const dynamoClient = new DynamoDBClient({
  region: "us-east-1",
  endpoint: process.env.AWS_ENDPOINT
});

const snsClient = new SNSClient({
  region: "us-east-1",
  endpoint: process.env.AWS_ENDPOINT
});

const docClient = DynamoDBDocumentClient.from(dynamoClient);

export const handler = async (event: any) => {
  console.log("EVENT RECEIVED:", JSON.stringify(event));

  const body =
    typeof event.body === "string"
      ? JSON.parse(event.body)
      : event.body;

  console.log("PARSED BODY:", body);

  const PK = `TASK_ID-${uuidv4()}`;

  const item = {
    PK: PK,
    title: body.title
  };

  // ✅ Save to DynamoDB
  await docClient.send(new PutCommand({
    TableName: "Tasks",
    Item: item
  }));

  // 🔥 NEW: Publish event to SNS
  await snsClient.send(new PublishCommand({
    TopicArn: process.env.TASK_TOPIC_ARN,
    Message: JSON.stringify({
      eventType: "TASK_CREATED",
      data: item
    })
  }));

  console.log("EVENT PUBLISHED TO SNS");

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Task created",
      item
    })
  };
};