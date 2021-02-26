//
// This script sends out email notification for Postgres password expiration
//
const AWS = require("aws-sdk");
const { Client } = require("pg");
var ses = new AWS.SES({ region: "us-east-1" });

const issueQuery = (
  username = process.env.postgresUser,
  password = process.env.postgresPassword,
  databasename = process.env.postgresDb,
  hostname = process.env.postgresHost,
  port = 5432
) => {
  console.log('Made it here', username);
  const clientConfig = {
    user: username,
    host: hostname,
    database: databasename,
    password: password,
    port: port,
  };
  const client = new Client(clientConfig);
  console.log('config', clientConfig);
  client.on('connect', err => {
    console.error('something bad has happened!', err.stack)
  })
  client.connect();
  console.log('did I connect?');
  
  client.query(
    "select now()",
//    "select usename, valuntil from pg_user where valuntil != 'infinity' and valuntil < now() + interval '25' day",
    (err, resp) => {
      console.log('RESPONSE', resp);
      if (err) {
        client.end();
        return console.error("error running query", err);
      } else {
        var numrows = resp.rows.length;
        console.log("Numrows:", numrows);
       // if (numrows > 0) emailOutput(resp.rows);
        client.end();
      }
    }
  );
};
const emailOutput = (result) => {
  console.log('Did I make it to the email function?', result);
  var params = {
    Destination: {
      ToAddresses: ["bdavenport@collabralink.com"],
    },
    Message: {
      Body: {
        Text: { Data: JSON.stringify(result) },
      },
      Subject: { Data: "Test email from Lambda function" },
    },
    Source: "mkalkar@collabralink.com",
  };
  ses.sendEmail(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });
};
const executeTask = () => {
  issueQuery();
};
exports.handler = (event, context, callback) => {
  executeTask();
};
