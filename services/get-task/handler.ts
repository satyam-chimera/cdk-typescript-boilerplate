import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1", endpoint: process.env.AWS_ENDPOINT });
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: any) => {
  console.log("EVENT:", JSON.stringify(event));

  const pk = event.pathParameters?.id;
  if (!pk) {
    return { statusCode: 400, body: JSON.stringify({ message: "id is required" }) };
  }

  const command = new GetCommand({ TableName: "Tasks", Key: { PK: pk } });
  const result = await docClient.send(command);

  return { statusCode: 200, body: JSON.stringify({ item: result.Item || null }) };
};