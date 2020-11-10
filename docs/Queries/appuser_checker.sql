select case when app.user_id is not null then 'Yes' else 'No' end has_appuser
	  ,case when roles.username is not null then 'Yes' else 'No' end has_rolesfromusername
	  ,case when states.username is not null then 'Yes' else 'No' end has_statesfromusername
	  ,auth.is_superuser
	  ,auth.username
	  ,auth.first_name
	  ,auth.last_name
	  ,auth.email
	  ,auth.is_active 
	  ,app.state_id as appuser_state_id
	  ,app.role as appuser_role
	  ,roles.user_role as rolefromusername_user_role
	  ,states.state_codes as statesfromusername_state_codes
from public.auth_user auth
	left outer join public.carts_api_appuser app on app.user_id = auth.id
	left outer join public.carts_api_rolefromusername roles on roles.username = auth.username
	left outer join public.carts_api_statesfromusername states on states.username = auth.username
where auth.username in ('WMLX','N4E4','PBWJ','SUGH','MA0A','P8ZB','PWLM','TH6V','TAK2','FOGW','D6K5','G24F')