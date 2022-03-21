export const roles = [
  { value: "admin_user", label: "Admin User", localUserName: "dev-admin" },
  { value: "bus_user", label: "Business User", localUserName: "dev-bus" },
  {
    value: "co_user",
    label: "Central Office User",
    localUserName: "dev-co_user",
  },
  { value: "state_user", label: "State User", localUserName: "dev-ak" },
];

export const getRoleLabel = (role) => {
  const user = roles.find((r) => {
    return r.value === role;
  });
  return user.label;
};

export const getLocalUserName = (role) => {
  const user = roles.find((r) => {
    return r.value === role;
  });
  return user.localUserName;
};
