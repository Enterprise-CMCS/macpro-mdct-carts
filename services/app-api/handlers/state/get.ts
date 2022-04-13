import handler from "../../libs/handler-lib";

export const getStates = handler(async (_event, _context) => {
  // TODO: Placeholder while we determine who owns this info and how it is updated
  return [
    { program_type: null, code: "AK", name: "Alaska" },
    { program_type: null, code: "AL", name: "Alabama" },
    { program_type: null, code: "CA", name: "California" },
    { program_type: null, code: "TX", name: "Texas" },
  ];
});
