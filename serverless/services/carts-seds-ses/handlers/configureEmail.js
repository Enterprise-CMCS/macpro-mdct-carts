//
// This script sends out email notification for Postgres password expiration
//
const AWS = require("aws-sdk");
const { Client } = require("pg");
const ses = new AWS.SES({ region: "us-east-1" });

const issueQuery = (
  username = process.env.postgresUser,
  password = process.env.postgresPassword,
  databasename = process.env.postgresDb,
  hostname = process.env.postgresHost,
  port = 5432
) => {
  console.log("Made it here", username);
  const clientConfig = {
    user: username,
    host: hostname,
    database: databasename,
    password: password,
    port: port,
  };
  const client = new Client(clientConfig);
  console.log("config", clientConfig);

  client.connect();
  //const query = 'select now()';
  //const query = 'select usename, valuntil from pg_user where valuntil != \'infinity\' and valuntil < now() + interval \'25\' day';

  const query = "select usename, valuntil from pg_user";
  client.query(query, (err, resp) => {
    if (err) {
      client.end();
      return console.error("error running query", err);
    } else {
      var numrows = resp.rows.length;
      if (numrows > 0) emailOutput(resp.rows);
      client.end();
    }
  });
};

const emailOutput = (result) => {
  console.log("DB Records:", result);
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

exports.handler = (event, context, callback) => {
  issueQuery();
};
