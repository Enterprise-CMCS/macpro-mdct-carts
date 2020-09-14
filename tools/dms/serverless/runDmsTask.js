// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DMS.html
const AWS = require('aws-sdk')

module.exports.main = event => {
    console.log(process.env.REPLICATION_TASK_ARN)
    var dms = new AWS.DMS();
    var params = {
        ReplicationTaskArn: process.env.REPLICATION_TASK_ARN,
        StartReplicationTaskType: "reload-target"
    };
    dms.startReplicationTask(params, function(error, data) {
        if (error) {
            console.log('AN ERROR OCCURRED')
            console.log(error);

            // Set region
            AWS.config.update({region: 'us-east-1'});

            // Create publish parameters
            var paramsSns = {
                Message: 'An error occurred while starting the SEDS nightly DMS job: ' + error,
                TopicArn: process.env.SNS_TOPIC_ARN
            };

            // Create promise and SNS service object
            var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(paramsSns).promise();

            // Handle promise's fulfilled/rejected states
            publishTextPromise.then(
            function(data) {
                console.log(`Message ${paramsSns.Message} send sent to the topic ${paramsSns.TopicArn}`);
                console.log("MessageID is " + data.MessageId);
            }).catch(
                function(err) {
                console.error(err, err.stack);
            });

            return
        }
        else {
            console.log('SUCCESS!')
            console.log(data);
            return
        }        
    });
};