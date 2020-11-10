--The job_code (which is actually LDAP Group) needs to be changed based on the environment you are in.
insert into carts_api_rolesfromjobcode (job_code, user_roles)
values ('CARTS_Group_Dev','{bus_user,co_user,state_user}')

insert into carts_api_rolesfromjobcode (job_code, user_roles)
values ('CARTS_Group_Dev_Admin','{bus_user,co_user,state_user,admin_user}')