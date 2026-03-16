import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({
  region: "us-east-1",
  endpoint: process.env.AWS_ENDPOINT
});

const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: any) => {
  console.log("EVENT RECEIVED:", JSON.stringify(event));

  const body =
    typeof event.body === "string"
      ? JSON.parse(event.body)
      : event.body;

  console.log("PARSED BODY:", body);
  const PK = `TASK#${uuidv4()}`;

  const params = {
    TableName: "Tasks",
    Item: {
      PK: PK,
      title: body.title
    }
  };

  await docClient.send(new PutCommand(params));

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Task created",
      item: params.Item
    })
  };
};