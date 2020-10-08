from django.contrib.auth.models import User, Group  # type: ignore
from rest_framework import exceptions  # type: ignore
from carts.auth import JwtAuthentication
from carts.carts_api.models import AppUser, State


class JwtDevAuthentication(JwtAuthentication):
    def authenticate(self, request):

        # try to pull a username out of the query params
        if "dev" in request.query_params:
            try:
                dev_username = request.query_params["dev"]

                dev_user, _ = User.objects.get_or_create(
                    first_name="DevFirst",
                    last_name="DevLast",
                    email=f"dev@{dev_username}.gov",
                    username=dev_username,
                )

                # Change this once we have dev users with different roles.
                role = "state_user"

                if role in ("admin_user", "co_user"):
                    state = None
                    if role == "admin_user":
                        group = Group.objects.get(name="Admin users")
                        dev_user.groups.set([group])
                else:
                    state = dev_username.split("dev-")[1].upper()
                    group = Group.objects.get(
                        name__endswith=f"{state} sections"
                    )
                    dev_user.groups.set([group.id])

                app_user, _ = AppUser.objects.get_or_create(user=dev_user)
                app_user.state = State.objects.get(code=state)
                app_user.role = role
                app_user.save()

                dev_user.save()

                return (dev_user, None)

            except Exception as e:
                raise exceptions.AuthenticationFailed(
                    "dev authentication failed"
                ) from e

        # no username specified in query params, fall back to jwt auth
        return super().authenticate(request)
