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
from carts.carts_api.models import (
    AppUser,
    State,
    RoleFromUsername,
    RolesFromJobCode,
    StatesFromUsername,
)
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
            user = _get_or_create_user(user_info)

            return (user, None)
        except Exception:
            raise exceptions.AuthenticationFailed("Authentication failed.")


def _get_or_create_user(user_info):
    user, _ = User.objects.get_or_create(
        username=user_info["preferred_username"],
    )
    user.first_name = user_info["given_name"]
    user.last_name = user_info["family_name"]
    user.email = user_info["email"]

    role_map = [*RolesFromJobCode.objects.all()]
    username_map = [*RoleFromUsername.objects.filter(username=user.username)]
    role = role_from_raw_ldap_job_codes(
        role_map, username_map, user_info["job_codes"]
    )
    states = []

    if role in ("state_user"):
        # This is where we load their state from the table that
        # associates EUA IDs to states, but here we default to MA,
        # which we'll need to change once we have proper test users.
        try:
            state_relationship = StatesFromUsername.objects.get(
                username=user.username
            )
            if state_relationship:
                state_codes = state_relationship.state_codes
                states = State.objects.filter(code__in=state_codes)
        except StatesFromUsername.DoesNotExist:
            pass

    app_user, _ = AppUser.objects.get_or_create(user=user)
    app_user.states.set(states)
    app_user.role = role
    app_user.save()

    if role == "state_user" and states:
        group = Group.objects.get(name__endswith=f"{states[0].code} sections")
        user.groups.set([group])

    if role == "admin_user":
        group = Group.objects.get(name="Admin users")
        user.groups.set([group])

    if role == "co_user":
        group = Group.objects.get(name="CO users")
        user.groups.set([group])

    if role == "bus_user":
        group = Group.objects.get(name="Business owner users")
        user.groups.set([group])

    user.save()

    return user
