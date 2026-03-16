import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1", endpoint: process.env.AWS_ENDPOINT });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: any) => {
  console.log("EVENT:", JSON.stringify(event));

  const pk = event.pathParameters?.id;
  const body = JSON.parse(event.body);

  if (!pk || !body.title) {
    return { statusCode: 400, body: JSON.stringify({ message: "id and title are required" }) };
  }

  const command = new UpdateCommand({
    TableName: "Tasks",
    Key: { PK: pk },
    UpdateExpression: "set #t = :title",
    ExpressionAttributeNames: { "#t": "title" },
    ExpressionAttributeValues: { ":title": body.title },
    ReturnValues: "ALL_NEW",
  });

  const result = await docClient.send(command);

  return { statusCode: 200, body: JSON.stringify({ item: result.Attributes }) };
};