import handler from "../../libs/handler-lib";

export const hello = handler(async (_event, _context) => {
  return "Hello World";
});
