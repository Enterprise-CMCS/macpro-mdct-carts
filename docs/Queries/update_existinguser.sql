--Update an existing user in carts_api_appuser
update public.carts_api_appuser app
	set state_id = 'MA'
		,role = 'state_user'
from public.auth_user auth
where auth.username = 'WAQF' and auth.id = app.user_id

--Update an existing user in carts_api_rolesfromjobcode
update public.carts_api_rolefromusername
	set user_role = 'state_user'
where username = 'WAQF'

--Update an existing user in carts_api_statesfromusername
update public.carts_api_statesfromusername
	set state_codes = '{MA}'
where username = 'WAQF'
