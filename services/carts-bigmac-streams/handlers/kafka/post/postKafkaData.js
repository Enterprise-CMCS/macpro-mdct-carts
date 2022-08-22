import KafkaSourceLib from "../../../libs/kafka-source-lib";

class PostKafkaData extends KafkaSourceLib {
  topicPrefix = "aws.mdct.seds.cdc";
  version = "v0";
  tables = ["state", "state-status"];
}

const postKafkaData = new PostKafkaData();

exports.handler = postKafkaData.handler.bind(postKafkaData);
