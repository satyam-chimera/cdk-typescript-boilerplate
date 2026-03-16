import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export class TaskApiGateway extends Construct {
  public readonly api: apigateway.RestApi;

  constructor(
    scope: Construct,
    id: string,
    lambdas: {
      createTaskLambda: NodejsFunction;
      getTaskLambda: NodejsFunction;
      updateTaskLambda: NodejsFunction;
      deleteTaskLambda: NodejsFunction;
    }
  ) {
    super(scope, id);

    this.api = new apigateway.RestApi(this, "TasksApi", {
      restApiName: "Tasks Service",
      description: "Service to manage tasks",
      deployOptions: { stageName: "dev" },
    });

    const tasks = this.api.root.addResource("tasks");

    // POST /tasks
    tasks.addMethod("POST", new apigateway.LambdaIntegration(lambdas.createTaskLambda));

    // GET /tasks/{id}
    const taskId = tasks.addResource("{id}");
    taskId.addMethod("GET", new apigateway.LambdaIntegration(lambdas.getTaskLambda));
    taskId.addMethod("PUT", new apigateway.LambdaIntegration(lambdas.updateTaskLambda));
    taskId.addMethod("DELETE", new apigateway.LambdaIntegration(lambdas.deleteTaskLambda));
  }
}