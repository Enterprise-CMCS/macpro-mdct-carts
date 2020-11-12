with current_users as (
select a."UserID"
	  ,u."UserName"
	  ,u."EmailAddress"
	  ,case when a."StateCode" = 'XX' then 'AK' else a."StateCode" end as state_assignment
from mbescbes.secstateaccess a
	join (select * from mbescbes.secuser where "Valid" = true and "TypeOfUser" = 'ST') u on u."UserID" = a."UserID"
where "System" = 'SARTS' and u."UserName" <> 'aaaa'
)

--add user to auth_user
-- insert into public.auth_user (password, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined)
-- Select ''
-- 	  ,false
-- 	  ,"UserID"
-- 	  ,substring("UserName" from '[^ ]+'::text) --first name
-- 	  ,replace(substr("UserName", strpos("UserName",' ')),' ','') --last name
-- 	  ,"EmailAddress"
-- 	  ,false
-- 	  ,true
-- 	  ,current_timestamp
-- from current_users

--Add the user to carts_api_appuser
insert into public.carts_api_appuser (state_id, role, user_id)
select state_assignment
	  ,'state_user'
	  ,(select id from public.auth_user where username = (select "UserID" from current_users))
from current_users
;

--Add the user to carts_api_rolefromusername
insert into public.carts_api_rolefromusername (username, user_role)
select "UserID"
	  ,'state_user'
from current_users
;

--Add the user to carts_api_statesfromusername
insert into public.carts_api_statesfromusername (username, state_codes)
select "UserID"
	  ,state_assignment
from current_users
;