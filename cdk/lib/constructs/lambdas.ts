import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";

export class TaskLambdas extends Construct {
  public readonly createTaskLambda: NodejsFunction;
  public readonly getTaskLambda: NodejsFunction;
  public readonly updateTaskLambda: NodejsFunction;
  public readonly deleteTaskLambda: NodejsFunction;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const basePath = path.join(__dirname, "../../../services");

    this.createTaskLambda = new NodejsFunction(this, "CreateTaskFunction", {
      functionName: "CreateTaskFunction",
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: path.join(basePath, "create-task/handler.ts"),
      handler: "handler",
      environment: { AWS_ENDPOINT: "http://localstack:4566" },
    });

    this.getTaskLambda = new NodejsFunction(this, "GetTaskFunction", {
      functionName: "GetTaskFunction",
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: path.join(basePath, "get-task/handler.ts"),
      handler: "handler",
      environment: { AWS_ENDPOINT: "http://localstack:4566" },
    });

    this.updateTaskLambda = new NodejsFunction(this, "UpdateTaskFunction", {
      functionName: "UpdateTaskFunction",
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: path.join(basePath, "update-task/handler.ts"),
      handler: "handler",
      environment: { AWS_ENDPOINT: "http://localstack:4566" },
    });

    this.deleteTaskLambda = new NodejsFunction(this, "DeleteTaskFunction", {
      functionName: "DeleteTaskFunction",
      runtime: lambda.Runtime.NODEJS_18_X,
      entry: path.join(basePath, "delete-task/handler.ts"),
      handler: "handler",
      environment: { AWS_ENDPOINT: "http://localstack:4566" },
    });
  }
}