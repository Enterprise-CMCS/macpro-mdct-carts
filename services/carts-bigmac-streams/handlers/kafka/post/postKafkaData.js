const { PostKafkaData } = require("../../../libs/PostKafkaData");

/**
 * Binds the topics for Kafka output to a handler, triggered by data streams
 */
const postKafkaData = new PostKafkaData();

exports.handler = postKafkaData.handler.bind(postKafkaData);
