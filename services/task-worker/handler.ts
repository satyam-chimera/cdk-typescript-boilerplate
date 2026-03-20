export const handler = async (event: any) => {
  console.log("SQS EVENT RECEIVED:", JSON.stringify(event));

  for (const record of event.Records || []) {
    try {
      const snsMessage = JSON.parse(record.body);
      const taskData = JSON.parse(snsMessage.Message);

      console.log("EVENT FROM SNS:", taskData);

      // Simulate sending notification
      console.log(`Notification: New task created - ${taskData.data.title}`);
    } catch (error) {
      console.error("Error processing message:", error);
      throw error; // triggers retry
    }
  }
};