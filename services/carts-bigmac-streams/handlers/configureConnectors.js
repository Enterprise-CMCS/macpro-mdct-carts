/* eslint-disable no-console */
var {
  ECSClient,
  ListTasksCommand,
  DescribeTasksCommand,
} = require("@aws-sdk/client-ecs");
var lodash = require("lodash");
var http = require("http");

const connectors = [
  {
    name: `${process.env.connectorPrefix}sink.lambda.enrollmentcounts`,
    config: {
      "tasks.max": "1",
      "connector.class":
        "com.nordstrom.kafka.connect.lambda.LambdaSinkConnector",
      topics: process.env.sinkTopics,
      "key.converter": "org.apache.kafka.connect.storage.StringConverter",
      "value.converter": "org.apache.kafka.connect.storage.StringConverter",
      "aws.region": process.env.sinkFunctionRegion,
      "aws.lambda.function.arn": process.env.sinkFunctionArn,
      "aws.lambda.batch.enabled": "false",
      "aws.credentials.provider.class":
        " com.amazonaws.auth.DefaultAWSCredentialsProviderChain",
    },
  },
];

// eslint-disable-next-line no-unused-vars
function myHandler(event, context, callback) {
  if (event.source == "serverless-plugin-warmup") {
    console.log(
      "Warmed up... although this function shouldn't be prewarmed.  So, turn it off."
    );
    return null;
  }
  console.log("Received event:", JSON.stringify(event, null, 2));
  var ecsClient = new ECSClient();
  var listParams = {
    cluster: process.env.cluster,
  };
  ecsClient
    .send(new ListTasksCommand(listParams))
    .then(function (taskArnsResult) {
      var describeParams = {
        cluster: process.env.cluster,
        tasks: taskArnsResult.taskArns,
      };
      return ecsClient.send(new DescribeTasksCommand(describeParams));
    })
    .then(function (describeResult) {
      describeResult.tasks.forEach((task) => {
        var ip = lodash.filter(
          task.attachments[0].details,
          (x) => x.name === "privateIPv4Address"
        )[0].value;
        console.log(`Configuring connector on worker:  ${ip}`);
        connectors.forEach(function (config) {
          //console.log(`Configuring connector with config: ${JSON.stringify(config, null, 2)}`);
          putConnectorConfig(ip, config, function (res) {
            console.log(res);
          });
        });
      });
    })
    .catch(function (err) {
      console.log(err, err.stack);
    });
}

function putConnectorConfig(workerIp, config, callback) {
  var retry = function (e) {
    console.log("Got error: " + e);
    setTimeout(function () {
      putConnectorConfig(workerIp, config, callback);
    }, 5000);
  };

  var options = {
    hostname: workerIp,
    port: 8083,
    path: `/connectors/${config.name}/config`,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const req = http
    .request(options, (res) => {
      console.log(`statusCode: ${res.statusCode}`);
      if (res.statusCode == "404") {
        retry.call(`${res.statusCode}`);
      }
      res.on("data", (d) => {
        console.log(d.toString("utf-8"));
      });
    })
    .on("error", retry);
  // eslint-disable-next-line no-unused-vars
  req.setTimeout(5000, function (thing) {
    this.socket.destroy();
  });
  req.write(JSON.stringify(config.config));
  req.end();
}

exports.handler = myHandler;
