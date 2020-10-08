from django.contrib.auth.models import User, Group  # type: ignore
from rest_framework import exceptions  # type: ignore
from carts.auth import JwtAuthentication
from carts.carts_api.models import AppUser, State


class JwtDevAuthentication(JwtAuthentication):
    def authenticate(self, request, username=None):
        dev_username = username

        try:
            if not dev_username:
                if "dev" in request.query_params:
                    try:
                        dev_username = request.query_params["dev"]
                    except Exception as e:
                        raise exceptions.AuthenticationFailed(
                            "dev authentication failed"
                        ) from e
        except Exception as e:
            raise exceptions.AuthenticationFailed(
                "dev authentication failed"
            ) from e

        if dev_username:
            _, suffix = dev_username.split("-")

            roles = {
                "admin": "admin_user",
                "co_user": "co_user",
                "ak": "state_user",
                "az": "state_user",
                "ma": "state_user",
            }

            role = roles[suffix]

            if role == "state_user":
                state_code = suffix.upper()
                state = State.objects.get(code=state_code)
                email = f"{dev_username}@{state.name.lower()}.gov"
            else:
                state = None
                email = f"{dev_username}@example.com"

            dev_user, _ = User.objects.get_or_create(
                username=dev_username,
            )
            dev_user.first_name = "DevFirst"
            dev_user.last_name = f"Dev{role}"
            dev_user.email = email

            if role == "admin_user":
                group = Group.objects.get(name="Admin users")
                dev_user.groups.set([group])
            # Once we have different permissions for co_users, add here.
            elif role == "state_user":
                group = Group.objects.get(
                    name__endswith=f"{state_code} sections"
                )
                dev_user.groups.set([group.id])

            app_user, _ = AppUser.objects.get_or_create(user=dev_user)
            app_user.state = state
            app_user.role = role
            app_user.save()

            dev_user.save()

            return (dev_user, None)

        # no username specified in query params, fall back to jwt auth
        return super().authenticate(request)
