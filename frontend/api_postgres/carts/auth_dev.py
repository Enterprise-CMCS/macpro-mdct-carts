from django.contrib.auth.models import User
from rest_framework import authentication
from rest_framework import exceptions
from carts.auth import JwtAuthentication
from carts.carts_api.models import AppUser

class JwtDevAuthentication(JwtAuthentication):
  def authenticate(self, request):

    # try to pull a username out of the query params
    if 'dev' in request.query_params:
      try:
        dev_username = request.query_params['dev']

        dev_user, created = User.objects.get_or_create(
          first_name='DevFirst',
          last_name='DevLast',
          email=f'dev@{dev_username}.gov',
          username=dev_username
        )

        if created:
          dev_user.groups.add(2)

        return (dev_user, None)
      except Exception:
        raise exceptions.AuthenticationFailed('dev authentication failed')

    # no username specified in query params, fall back to jwt auth
    return super(JwtDevAuthentication, self).authenticate(request)
