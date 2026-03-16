import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { TasksTable } from "./constructs/dynamodb";
import { TaskLambdas } from "./constructs/lambdas";
import { TaskApiGateway } from "./constructs/api-gateway";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new TasksTable(this, "TasksTable");

    const lambdas = new TaskLambdas(this, "TaskLambdas");

    // Grant Lambda access to DynamoDB
    table.table.grantReadWriteData(lambdas.createTaskLambda);
    table.table.grantReadWriteData(lambdas.getTaskLambda);
    table.table.grantReadWriteData(lambdas.updateTaskLambda);
    table.table.grantReadWriteData(lambdas.deleteTaskLambda);

    new TaskApiGateway(this, "TaskApiGateway", lambdas);
  }
}