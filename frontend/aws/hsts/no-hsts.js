// this handler is used when we DO NOT want hsts applied to cloudfront (in branch deploys)
function handler(event) {
  return event.response;
}
