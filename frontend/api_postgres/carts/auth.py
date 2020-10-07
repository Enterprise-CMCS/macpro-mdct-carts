from django.contrib.auth.models import Group, User  # type: ignore
from rest_framework import authentication  # type: ignore
from rest_framework import exceptions
from carts.oidc import (
    extract_kid,
    fetch_pub_key,
    fetch_user_info,
    invalidate_cache,
    verify_token,
)
from carts.carts_api.models import AppUser, State
from carts.carts_api.model_utils import role_from_raw_ldap_job_codes


class JwtAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        raw_token = self._extract_token(request)

        try:
            return self._do_authenticate(raw_token)
        except Exception as e:
            msg = [
                "authentication failed on first attempt, ",
                "invalidating cache and trying again...",
            ]
            print(e, "".join(msg), flush=True)
            invalidate_cache()

        return self._do_authenticate(raw_token)

    def _extract_token(self, request):
        try:
            token_string = request.META.get("HTTP_AUTHORIZATION")
            return token_string.split("Bearer ")[1]
        except:
            raise exceptions.AuthenticationFailed(
                "Authentication failed: Bearer token missing!"
            )

    def _do_authenticate(self, token):
        try:
            kid = extract_kid(token)
            key = fetch_pub_key(kid)
            verify_token(token, key)

            user_info = fetch_user_info(token)
            user = self._get_or_create_user(user_info)

            return (user, None)
        except Exception:
            raise exceptions.AuthenticationFailed("Authentication failed.")

    def _get_or_create_user(self, user_info):
        user, _ = User.objects.get_or_create(
            first_name=user_info["given_name"],
            last_name=user_info["family_name"],
            email=user_info["email"],
            username=user_info["preferred_username"],
        )

        """
        eua_id = user.username
        eua_ord = ord(eua_id[0]) % 3
        fake_state_map = {
            0: "AK",
            1: "AZ",
            2: "MA",
        }
        fake_state = fake_state_map[eua_ord]
        """
        # TODO: have to switch this back and forth in dev until we get test EUA
        # users:
        role = role_from_raw_ldap_job_codes(user_info["job_codes"])
        # role = "state_user"

        if role in ("admin_user", "co_user"):
            state = None
        else:
            # This is where we would load their state from the table that
            # associates EUA IDs to states, but instead just go with MA:
            state = State.objects.get(code="MA")

        app_user, _ = AppUser.objects.get_or_create(user=user)
        app_user.state = state
        app_user.role = role
        app_user.save()

        if role == "state_user" and state:
            group = Group.objects.get(name__endswith=f"{state.code} sections")
            user.groups.set([group])

        if role == "admin_user":
            group = Group.objects.get(name="Admin users")
            user.groups.set([group])

        user.save()

        return user
