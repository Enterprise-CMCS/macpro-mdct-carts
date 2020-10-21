from django.contrib.auth.models import User, Group  # type: ignore
from rest_framework import serializers  # type: ignore
from carts.carts_api.models import (
    RoleFromUsername,
    RoleFromJobCode,
    RolesFromJobCode,
    Section,
    SectionBase,
    SectionSchema,
    State,
    StatesFromUsername,
    StateStatus,
    FMAP,
    ACS,
)


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "email", "groups"]


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]


class SectionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Section
        fields = ["contents"]


class SectionBaseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SectionBase
        fields = ["contents"]


class SectionSchemaSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SectionSchema
        fields = ["year", "contents"]


class FMAPSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = FMAP
        fields = ["fiscal_year", "enhanced_FMAP"]


class ACSSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ACS
        fields = [
            "year",
            "number_uninsured",
            "number_uninsured_moe",
            "percent_uninsured",
            "percent_uninsured_moe",
        ]


class StateSerializer(serializers.HyperlinkedModelSerializer):
    fmap_set = FMAPSerializer(many=True, read_only=True)
    acs_set = ACSSerializer(many=True, read_only=True)

    class Meta:
        model = State
        fields = ["code", "name", "fmap_set", "acs_set"]


class StatesFromUsernameSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = StatesFromUsername
        fields = ["username", "state_codes"]


class RoleFromJobCodeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = RoleFromJobCode
        fields = ["job_code", "user_role"]


class RolesFromJobCodeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = RolesFromJobCode
        fields = ["job_code", "user_roles"]


class RoleFromUsernameSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = RoleFromUsername
        fields = ["username", "user_role"]


class StateStatusSerializer(serializers.HyperlinkedModelSerializer):
    state = serializers.PrimaryKeyRelatedField(queryset=State.objects.all())

    class Meta:
        model = StateStatus
        fields = ["state", "year", "status", "last_changed", "user_name"]
