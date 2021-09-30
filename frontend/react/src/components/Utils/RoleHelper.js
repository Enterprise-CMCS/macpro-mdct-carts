export const getRoleLabel = (role)=> {
    const roles = {
        admin_user: "Admin User",
        bus_user: "Business User",
        co_user: "Central Office User",
        state_user: "State User"
    }
    return roles[role];
}

export const roles = {
    admiUser: "admin_user",
    businessUser: "bus_user",
    centralOfficeUser: "co_user",
    stateUser: "state_user"
}