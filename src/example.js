const AWS = require("aws-sdk");
const credentialsProvider = require("./index");

AWS.config.update({ region: "eu-west-1" });
var sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
const QueueUrl =
  "https://sqs.eu-west-1.amazonaws.com/169163488685/phill-test-topic-queue";

const parameters = {
  AttributeNames: ["SentTimestamp"],
  MaxNumberOfMessages: 1,
  MessageAttributeNames: ["All"],
  QueueUrl,
  VisibilityTimeout: 20,
  WaitTimeSeconds: 0
};

const getMessages = () => {
  sqs.receiveMessage(parameters, async function(err, data) {
    if (err) {
      console.log("Receive Error", err);
    } else if (data.Messages) {
      var deleteParams = {
        QueueUrl,
        ReceiptHandle: data.Messages[0].ReceiptHandle
      };
      sqs.deleteMessage(deleteParams, function(err, data) {
        if (err) {
          console.log("Delete Error", err);
        } else {
          console.log("Message Deleted", data.ResponseMetadata.RequestId);
        }
      });
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 3000);
      });
      getMessages();
    }
  });
};

credentialsProvider.getCredentials().then(credentials => {
  AWS.config.update({ credentials });
  getMessages();
});
