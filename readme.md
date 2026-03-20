## **Current Project Architecture (Working State)**

### **1. DynamoDB**

* Table: `Tasks`
* Partition Key: `PK` (string)
* Mode: On-demand (`PAY_PER_REQUEST`)
* Used by all task-related Lambdas for CRUD operations.

### **2. Lambda Functions**

* **CreateTaskLambda**

  * Adds a task to DynamoDB.
  * Publishes an event to SNS after task creation.

* **GetTaskLambda**

  * Fetches a task from DynamoDB by PK.

* **UpdateTaskLambda**

  * Updates a task in DynamoDB.

* **DeleteTaskLambda**

  * Deletes a task in DynamoDB.

* **Worker Lambda** *(currently paused)*

  * Planned to consume messages from SQS and process notifications.
  * Currently not required; flow is working without it.

### **3. API Gateway**

* Exposes REST APIs:

  * `POST /tasks` → CreateTaskLambda
  * `GET /tasks/{PK}` → GetTaskLambda
  * `PUT /tasks/{PK}` → UpdateTaskLambda
  * `DELETE /tasks/{PK}` → DeleteTaskLambda

* **Verified**: All API endpoints are working locally.

### **4. SNS (TaskEvents)**

* Topic: `task-events`
* Used to publish notifications whenever a task is created.

### **5. SQS (TaskQueue)**

* Queue subscribed to SNS topic `task-events`.
* Receives messages when tasks are created.
* **Verified**: Messages are correctly arriving in SQS.

### **6. LocalStack Setup**

* Running all AWS services locally (DynamoDB, Lambda, API Gateway, SNS, SQS, CloudWatch Logs).
* Environment variables used:

  * `AWS_ENDPOINT=http://localstack:4566`
  * `TASK_TOPIC_ARN` for Lambdas that publish to SNS.
  * `QUEUE_NAME` for worker Lambdas (future use).

---

## **Testing Steps (Local)**

1. **Create a Task (POST)**

```bash
curl -X POST http://localhost:4566/restapis/<api-id>/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title": "Learn Serverless"}'
```

* Check DynamoDB: `aws --endpoint-url=http://localhost:4566 dynamodb scan --table-name Tasks`
* Check SNS publish in Lambda logs:

```bash
aws --endpoint-url=http://localhost:4566 logs filter-log-events --log-group-name /aws/lambda/CreateTaskFunction
```

2. **Get a Task (GET)**

```bash
curl -X GET http://localhost:4566/restapis/<api-id>/tasks/<PK>
```

3. **Update a Task (PUT)**

```bash
curl -X PUT http://localhost:4566/restapis/<api-id>/tasks/<PK> \
  -H 'Content-Type: application/json' \
  -d '{"title": "Updated Title"}'
```

4. **Delete a Task (DELETE)**

```bash
curl -X DELETE http://localhost:4566/restapis/<api-id>/tasks/<PK>
```

5. **Check SQS for SNS Messages**

```bash
aws --endpoint-url=http://localhost:4566 sqs receive-message --queue-url http://localhost:4566/000000000000/task-queue
```

6. **Check Subscriptions**

```bash
aws --endpoint-url=http://localhost:4566 sns list-subscriptions
```

7. **Lambda Logs**

```bash
aws --endpoint-url=http://localhost:4566 logs describe-log-streams --log-group-name /aws/lambda/CreateTaskFunction
aws --endpoint-url=http://localhost:4566 logs filter-log-events --log-group-name /aws/lambda/CreateTaskFunction
```

---

## **Notes / Memory Updates**

* All CRUD operations for tasks are **working with DynamoDB and API Gateway**.
* **SNS → SQS integration is working**, verified via subscription and queue messages.
* Worker Lambda is **not deployed/paused**, to avoid breaking the flow.
* All Lambdas use Node.js 18 runtime.
* LocalStack endpoint is used for all AWS SDK calls: `http://localhost:4566`.
* Environment variables are set appropriately (`AWS_ENDPOINT`, `TASK_TOPIC_ARN`, `QUEUE_NAME`).

--
