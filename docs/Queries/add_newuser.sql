--set EUA ID of user that you want to add
with newuser (eua, roles, states) as (
	values ('WMLX', 'state_user', 'MA')
)
--eua varchar := 'WMLX';
--roles varchar := 'state_user';

--Add the user to auth_user
insert into public.auth_user (password, is_superuser, username, is_staff, is_active)
values ('', false, (select eua from newuser), false, true)
;

--Add the user to carts_api_appuser
insert into public.carts_api_user (state_id, role, user_id)
values ((select states from newuser), (select roles from newuser), (select id from public.auth_user where username = (select eua from newuser)))
;

--Add the user to carts_api_rolefromusername
insert into public.carts_api_rolefromusername (username, user_role)
values ((select eua from newuser), (select roles from newuser))
;

--Add the user to carts_api_statesfromusername
insert into public.carts_api_statesfromusername (username, state_codes)
values ((select eua from newuser),(select eua from newuser))
;

