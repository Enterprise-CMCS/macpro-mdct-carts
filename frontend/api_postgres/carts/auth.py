from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import authentication
from rest_framework import exceptions
from jwcrypto.jwk import JWK  # type: ignore
import python_jwt as jwt  # type: ignore
import json
import requests

class JwtAuthentication(authentication.BaseAuthentication):
  def authenticate(self, request):
    try:
      token, kid = self._process_token(request)
      key = self._fetch_pub_key(kid)
      self._verify_token(token, key)

      user_info = self._fetch_user_info(token)
      user = self._get_or_create_user(user_info)

      return (user, None)
    except Exception as e:
      raise exceptions.AuthenticationFailed('Authentication failed.')
    
    return (None, None)


  def _get_or_create_user(self, user_info):
    user, created = User.objects.get_or_create(
      first_name=user_info['given_name'],
      last_name=user_info['family_name'],
      email=user_info['email'],
      username=user_info['preferred_username']
    )
    if created:
      print(f'created new user with id {user.id}')

    return user


  def _verify_token(self, token, pub_key):
    jwk = JWK.from_json(json.dumps(pub_key))
    return jwt.verify_jwt(
      token,
      jwk,
      ['RS256'],
      checks_optional=True
    )


  def _process_token(self, request):
    token_string = request.META.get("HTTP_AUTHORIZATION")
    raw_token = token_string.split("Bearer ")[1]
    token = jwt.process_jwt(raw_token)
    kid = token[0]['kid']
    return raw_token, kid


  def _fetch_pub_key(self, kid):
    jwks_uri = self._metadata('jwks_uri')
    jwks_res = requests.get(jwks_uri)
    jwks = jwks_res.json()['keys']
    return next(x for x in jwks if x['kid'] == kid)


  def _fetch_user_info(self, token):
    user_info_uri = self._metadata('userinfo_endpoint')
    user_info_res = requests.get(user_info_uri, headers={"Authorization": f"Bearer {token}"})
    return user_info_res.json()


  def _metadata(self, k):
    discovery_url = settings.JWT_AUTHENTICATION['OPENID_DISCOVERY_URL']
    discovery_doc = requests.get(discovery_url).json()

    return discovery_doc[k]

