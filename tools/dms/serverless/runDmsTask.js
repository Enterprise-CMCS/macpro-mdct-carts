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
            console.log(error, error.stack);
            return
        }
        else {
            console.log('SUCCESS!')
            console.log(data);
            return
        }        
    });
};