from django.contrib.postgres.fields import JSONField  # type: ignore
from django.db import models  # type: ignore
import json
import jsonschema  # type: ignore
from carts.carts_api.model_utils import US_STATES, USER_ROLES


class SectionSchema(models.Model):
    year = models.IntegerField()
    contents = JSONField()


class SectionBase(models.Model):
    contents = JSONField()

    def clean(self):
        schema_object = SectionSchema.objects.first()
        schema = schema_object.contents
        jsonschema.validate(instance=self.contents, schema=schema)


class Section(models.Model):
    contents = JSONField()

    def clean(self):
        schema_object = SectionSchema.objects.first()
        schema = schema_object.contents
        jsonschema.validate(instance=self.contents, schema=schema)


class AppUser(models.Model):
    # Eventually state will need to be a foreign key reference to the
    # appropriate State instance.
    state = models.CharField(max_length=2, choices=US_STATES)
    email = models.EmailField()
    eua_id = models.CharField(max_length=4)
    role = models.CharField(max_length=32, choices=USER_ROLES)
