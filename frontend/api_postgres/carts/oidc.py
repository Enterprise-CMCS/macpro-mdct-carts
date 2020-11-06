from jwcrypto.jwk import JWK  # type: ignore
from carts.cache import cached
from django.conf import settings
from django.core.cache import caches
import python_jwt as jwt
import json
import requests

CACHE_LOCATION = "carts.oidc"


def extract_kid(token):
    token = jwt.process_jwt(token)
    return token[0]["kid"]


@cached(CACHE_LOCATION, 3600)
def fetch_discovery_doc():
    discovery_url = settings.JWT_AUTHENTICATION["OPENID_DISCOVERY_URL"]
    return requests.get(discovery_url).json()


@cached(CACHE_LOCATION, 3600)
def fetch_pub_key(kid):
    jwks = fetch_jwks()
    return next(x for x in jwks if x["kid"] == kid)


@cached(CACHE_LOCATION, 3600)
def fetch_jwks():
    jwks_uri = metadata("jwks_uri")
    jwks_res = requests.get(jwks_uri)
    return jwks_res.json()["keys"]


@cached(CACHE_LOCATION, 300)
def fetch_user_info(token):
    print("fetching user info with token: " + token)

    user_info_uri = metadata("userinfo_endpoint")
    print("fetching user info from: " + user_info_uri)

    try:
        user_info_res = requests.get(
            user_info_uri, headers={"Authorization": f"Bearer {token}"}
        )

    except HTTPError as http_err:
        print(
            f"HTTP ERROR === fetching user failed: {http_err}"
        )  # as of python 3.6
    except Exception as err:
        print(
            f"EXCEPTION === fetching user failed:  {err}"
        )  # as of python 3.6
    else:
        print("!! SUCCESS fetching user info", user_info_res.json())

    print(f"\n\n\n!!!got user info from okta: ", user_info_res.json())
    return user_info_res.json()


def invalidate_cache():
    caches[CACHE_LOCATION].clear()


def metadata(key):
    discovery_doc = fetch_discovery_doc()
    return discovery_doc[key]


def verify_token(token, pub_key):
    print(f"\n\n\n^^^^verifying token")
    jwk = JWK.from_json(json.dumps(pub_key))
    print(f"\n\n\n^^^^jwk obtained")

    return jwt.verify_jwt(token, jwk, ["RS256"], checks_optional=True)
