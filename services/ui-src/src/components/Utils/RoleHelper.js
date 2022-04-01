import { UserRoles } from "../../types";

export const roles = [
  { value: UserRoles.ADMIN, label: "Admin User", localUserName: "dev-admin" },
  { value: UserRoles.BO, label: "Business User", localUserName: "dev-bus" },
  {
    value: UserRoles.CO,
    label: "Central Office User",
    localUserName: "dev-co_user",
  },
  { value: UserRoles.STATE, label: "State User", localUserName: "dev-ak" },
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
