from django.contrib.auth.models import User, Group  # type: ignore
from django.conf import settings
from rest_framework import exceptions  # type: ignore
from rest_framework.authentication import BaseAuthentication  # type: ignore
from carts.carts_api.models import AppUser, State, StatesFromUsername

ROLES = {
    "admin": "admin_user",
    "bus": "bus_user",
    "co_user": "co_user",
    "ak": "state_user",
    "az": "state_user",
    "ma": "state_user",
}


def are_fake_users_allowed():
    """
    Returns whether fake users are allowed for this environment
    """
    return getattr(settings, "ALLOW_FAKE_USERS", False)


def get_or_create_fake_user(dev_username):
    """
    Returns a fake user object for authentication based on the provided username.
    E.g. `dev-admin` will return an admin user and `dev-ak` will return a state user
    for the state of AK. Possible roles are defined in the ROLES dictionary
    """
    _, suffix = dev_username.split("-")
    if suffix not in ROLES:
        raise "fake user suffix not recognized"

    role = ROLES[suffix]
    if role == "state_user":
        state_codes = [suffix.upper()]
        states = State.objects.filter(code__in=state_codes)
        email = f"{dev_username}@{states[0].name.lower()}.gov"
        try:
            state_relationship = StatesFromUsername.objects.get(
                username=dev_username
            )
            if state_relationship:
                state_codes = state_relationship.state_codes
                states = State.objects.filter(code__in=state_codes)
        except StatesFromUsername.DoesNotExist:
            pass
    else:
        states = []
        email = f"{dev_username}@example.com"

    dev_user, _ = User.objects.get_or_create(
        username=dev_username,
    )
    dev_user.first_name = "DevFirst"
    dev_user.last_name = f"Dev{role}"
    dev_user.email = email
    try:
        if role == "admin_user":
            group = Group.objects.get(name="Admin users")
            dev_user.groups.set([group])
        # Once we have different permissions for co_users, add here.
        elif role in ("bus_user", "co_user"):
            group = Group.objects.get(name="Business owner users")
            dev_user.groups.set([group])
        elif role == "state_user":
            group = Group.objects.get(
                name__endswith=f"{state_codes[0]} sections"
            )
            dev_user.groups.set([group])
    except Exception as err:
        raise exceptions.AuthenticationFailed("authentication failed") from err

    app_user, _ = AppUser.objects.get_or_create(user=dev_user)
    app_user.states.set(states)
    app_user.role = role
    app_user.save()

    dev_user.save()

    return dev_user


class FakeUserAuthentication(BaseAuthentication):
    """
    Allows for impersonating a fake user by passing a query string parameter
    of `dev=dev-ROLE` where ROLE is one of the potential fake user roles defined
    in ROLES. Requires ALLOW_FAKE_USERS be set to true in the django
    settings config for the environment.

    Intended for local development use.
    """

    def authenticate(self, request):
        if not are_fake_users_allowed():
            # Skip to next authenticator if fake users are not enabled
            # for this environment
            return None

        if "dev" not in request.query_params:
            # Skip to the next authenticator if not a fake user request
            return None

        try:
            username = request.query_params["dev"]
            fake_user = get_or_create_fake_user(username)
            return (fake_user, None)
        except Exception as e:
            raise exceptions.AuthenticationFailed(
                "fake user authentication failed"
            ) from e
