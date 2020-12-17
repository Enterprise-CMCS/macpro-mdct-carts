import jsonschema  # type: ignore
from django.contrib.auth.models import User  # type: ignore
from django.contrib.postgres.fields import (  # type: ignore
    ArrayField,
    JSONField,
)
from django.db import models  # type: ignore
from carts.carts_api.model_utils import PROGRAM_TYPES, USER_ROLES, STATUSES
from django_db_views.db_view import DBView


class SectionSchema(models.Model):
    year = models.IntegerField()
    contents = JSONField()


class SectionBase(models.Model):
    contents = JSONField()

    def clean(self):
        schema_object = SectionSchema.objects.first()
        schema = schema_object.contents
        jsonschema.validate(instance=self.contents, schema=schema)

    def save(self, *args, **kwargs):
        self.clean()
        super(SectionBase, self).save(*args, **kwargs)


class Section(models.Model):
    contents = JSONField()

    def clean(self):
        schema_object = SectionSchema.objects.first()
        schema = schema_object.contents
        jsonschema.validate(instance=self.contents, schema=schema)

    def save(self, *args, **kwargs):
        self.clean()
        super(Section, self).save(*args, **kwargs)


class State(models.Model):
    """
    A model to hold and reference state specific information
    """

    code = models.CharField(
        help_text="A unique two-character state code",
        max_length=2,
        primary_key=True,
    )
    name = models.CharField(help_text="Full state name", max_length=100)
    program_type = models.CharField(
        max_length=32, choices=PROGRAM_TYPES, default="combo"
    )
    program_names = ArrayField(models.CharField(max_length=64), default=list)


class AppUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    state = models.ForeignKey(
        State, on_delete=models.CASCADE, null=True, related_name="appusers"
    )
    states = models.ManyToManyField(State)
    role = models.CharField(max_length=32, choices=USER_ROLES)


class FMAP(models.Model):
    """
    FMAP - Federal Medical Assistance Percentage - Rates used for determining
    the federal matching percentage for states/territories for Medicaid and
    CHIP.  FY 20 data is in docs/FMAPfy20_data and can be loaded with
    generate_fixtures.py
    # TODO: is that data actually in 2020-fmap-data.csv?
    """

    state = models.ForeignKey(State, on_delete=models.CASCADE)
    fiscal_year = models.IntegerField(
        help_text="The 4-digit fiscal year for this FMAP"
    )
    enhanced_FMAP = models.DecimalField(
        help_text="Enhanced FMAP percentage", decimal_places=2, max_digits=5
    )


class ACS(models.Model):
    """ACS - American Community Survey data for each state for the number and
    percentage of children under 200% FPL that are uninsured, by year. Used to
    populate the table in section 2A.
    """

    state = models.ForeignKey(State, on_delete=models.CASCADE)
    year = models.IntegerField(help_text="The 4-digit year of the ACS")
    number_uninsured = models.IntegerField(
        help_text="the number of uninsured children under 200% FPL"
    )
    number_uninsured_moe = models.IntegerField(
        help_text="the margin of error for the number of uninsured children"
    )
    # help_text has exactly five spaces between “uninsured” and “children” in
    # order to avoid triggering a database migration for such a minor issue.
    percent_uninsured = models.DecimalField(
        help_text="percentage of uninsured     children",
        decimal_places=1,
        max_digits=5,
    )
    # The same applies below:
    help_text = "     ".join(
        ["the margin of error", "for the percentage of uninsured children"]
    )
    percent_uninsured_moe = models.DecimalField(
        help_text=help_text,
        decimal_places=1,
        max_digits=5,
    )


class StatesFromUsername(models.Model):
    """
    Associate states with a user.
    Keyed off their CMS identifier, which is initially EUA ID but may become a
    different id in future.
    Every time a user logs in, their username is checked against the contents
    of this table, and their states are set to whatever is in this table.
    Note that this checks the string of the username and not the user instance;
    the contents of this table exists prior to any of the users logging in.
    Similarly, this uses the two-character state code, not the state instance,
    as state.
    """

    username = models.CharField(max_length=64, unique=True)
    state_codes = ArrayField(models.CharField(max_length=2))


class RoleFromJobCode(models.Model):
    """
    Associate job codes with a role.
    Every time a user logs in, their job code is checked against the contents
    of this table, and their role is set to whatever is in this table.
    Note that this checks the string of the username and not the user instance;
    the contents of this table exists prior to any of the users logging in.
    Similarly, the user role is a string and not the instance.
    """

    job_code = models.CharField(max_length=64, unique=True)
    user_role = models.CharField(max_length=64, choices=USER_ROLES)


class RolesFromJobCode(models.Model):
    """
    Associate job codes with a roles.
    Every time a user logs in, their job code is checked against the contents
    of this table, and they are allowed to have whatever role is assigned to
    them in this table.
    Note that regardless of the order in this table, they will be assigned the
    highest-privilege role in the list associated with their job code. This may
    be changed by associating their username with a lower-privilege role via
    RoleFromUsername, but note that the role assigned to them there must be
    among the roles assigned to them here.
    Note that this checks the string of the username and not the user instance;
    the contents of this table exists prior to any of the users logging in.
    Similarly, the user role is a string and not the instance.
    """

    job_code = models.CharField(max_length=64, unique=True)
    user_roles = ArrayField(
        models.CharField(max_length=64, choices=USER_ROLES)
    )


class RoleFromUsername(models.Model):
    """
    Assign role and states according to username. An extended version of
    StatesFromUsername that can also assign a role, essentially. The role
    should still respect the assignment of role via job code—essentially, if
    none of their job codes allow them to have the role assigned via the
    endpoint entering data for this model, the assignment shouldn't happen.
    """

    username = models.CharField(max_length=64, unique=True)
    user_role = models.CharField(max_length=64, choices=USER_ROLES)


class StateStatus(models.Model):
    """
    Represents the status of the state's CARTS report for a given year.
    """

    state = models.ForeignKey(State, on_delete=models.CASCADE, null=True)
    year = models.IntegerField(null=True)
    status = models.CharField(
        max_length=32, choices=STATUSES, default="not_started"
    )
    last_changed = models.DateTimeField(null=True)
    user_name = models.TextField(null=True)


class UploadedFiles(models.Model):
    filename = models.CharField(max_length=256, default="")
    aws_filename = models.CharField(max_length=256, default="")
    question_id = models.CharField(max_length=16)
    uploaded_date = models.DateTimeField(null=False, auto_now_add=True)
    uploaded_username = models.CharField(max_length=16, default="")
    uploaded_state = models.CharField(max_length=16, default="")

    def save(self, *args, **kwargs):
        self.clean()
        super(UploadedFiles, self).save(*args, **kwargs)


class UserProfiles(DBView):
    password = models.CharField(max_length=100)
    last_login = models.DateTimeField(auto_now_add=True)
    is_superuser = models.BooleanField()
    username = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField(auto_now_add=True)
    user_role = models.CharField(max_length=100)
    state_codes = models.CharField(max_length=100)

    view_definition = """
        SELECT a.id,
            a.password,
            a.last_login,
            a.is_superuser,
            a.username,
            a.first_name,
            a.last_name,
            a.email,
            a.is_staff,
            a.is_active,
            a.date_joined,
            r.user_role,
            s.state_codes
           FROM ((auth_user a
             LEFT JOIN carts_api_rolefromusername r ON (((r.username)::text = (a.username)::text)))
             LEFT JOIN carts_api_statesfromusername s ON (((s.username)::text = (a.username)::text)));
    """

    class Meta:
        managed = False
        db_table = "vw_userprofile"
