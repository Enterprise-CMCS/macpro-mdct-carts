import handler from "../../libs/handler-lib";

export const hello = handler(async (event, context) => {
  return "Hello World";
});
