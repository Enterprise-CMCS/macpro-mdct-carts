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


class FMAP(models.Model):
    """FMAP - Federal Medical Assistance Percentage - Rates used for determining
    the federal matching percentage for states/territories for Medicaid and CHIP.
    FY 20 data is in docs/FMAPfy20_data and can be loaded with generate_fixtures.py
    """
    state = models.CharField(help_text="Please use the two character state abbreviation", db_index=True, max_length=2)
    fiscal_year = models.IntegerField(help_text="The 4-digit fiscal year for this FMAP")
    enhanced_FMAP = models.DecimalField(help_text="Enhanced FMAP percentage", decimal_places=2, max_digits=5)
