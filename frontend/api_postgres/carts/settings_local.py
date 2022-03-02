from carts.settings import *

REST_FRAMEWORK["DEFAULT_AUTHENTICATION_CLASSES"] = [
    "carts.auth_fake.FakeUserAuthentication",
    "carts.auth.JwtAuthentication",
]

# Enable support for authenticating with fake users (like dev-ak)
# Also requires carts.auth_fake.FakeUserAuthentication being added to the front
# of the authentication classes for DRF
ALLOW_FAKE_USERS = True
