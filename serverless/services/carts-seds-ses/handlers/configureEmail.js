//
// This script sends out email notification for Postgres password expiration
//
const AWS = require("aws-sdk");
const { Client } = require("pg");
var ses = new AWS.SES({ region: "us-east-1" });
const issueQuery = (
  username,
  password,
  databasename,
  hostname,
  port = 5432
) => {
  const client = new Client({
    user: username,
    host: hostname,
    database: databasename,
    password: password,
    port: port,
  });
  client.connect();
  client.query(
    "select usename, valuntil from pg_user where valuntil != 'infinity' and valuntil < now() + interval '25' day",
    (err, resp) => {
      if (err) {
        client.end();
        return console.error("error running query", err);
      } else {
        var numrows = resp.rows.length;
        console.log("Numrows:", numrows);
        if (numrows > 0) emailOutput(resp.rows);
        client.end();
      }
    }
  );
};
const emailOutput = (result) => {
  console.log(result);
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
  let ssm = new AWS.SSM({ region: "us-east-1" });
  let ssmParameters = {
    "/master/postgres_db": null,
    "/master/postgres_host": null,
    "/master/postgres_password": null,
    "/master/postgres_user": null,
  };
  let params = {
    Names: Object.keys(ssmParameters),
    WithDecryption: true,
  };
  return ssm.getParameters(params, function (err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else {
      data.Parameters.forEach((item) => {
        //console.log(item);
        let value = item.Value;
        let name = item.Name;
        ssmParameters[name] = value;
      });
      issueQuery(
        ssmParameters["/master/postgres_user"],
        ssmParameters["/master/postgres_password"],
        ssmParameters["/master/postgres_db"],
        ssmParameters["/master/postgres_host"]
      );
    }
  });
};
exports.handler = (event, context, callback) => {
  executeTask();
};
