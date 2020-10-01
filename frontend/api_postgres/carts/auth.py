
from django.contrib.auth.models import User
from django.core.cache import caches
from rest_framework import authentication
from rest_framework import exceptions
from carts.oidc import (
  extract_kid,
  fetch_pub_key,
  fetch_user_info,
  invalidate_cache,
  verify_token
)
import json
import requests


class JwtAuthentication(authentication.BaseAuthentication):
  def authenticate(self, request):
    token_string = request.META.get("HTTP_AUTHORIZATION")
    raw_token = token_string.split("Bearer ")[1]

    try:
      return self._do_authenticate(raw_token)
    except Exception:
      print('authentication failed on first attempt, invalidating cache and trying again...')
      invalidate_cache()

    return self._do_authenticate(raw_token)


  def _do_authenticate(self, token):
    try:
      kid = extract_kid(token)
      key = fetch_pub_key(kid)
      verify_token(token, key)
      
      user_info = fetch_user_info(token)
      user = self._get_or_create_user(user_info)

      return (user, None)
    except Exception as e:
      raise exceptions.AuthenticationFailed('Authentication failed.')


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