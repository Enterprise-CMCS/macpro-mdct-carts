from django.contrib.auth.models import User, Group
from rest_framework import serializers
from carts.carts_api.models import Section, SectionBase, SectionSchema


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class SectionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Section
        fields = ['contents']


class SectionBaseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SectionBase
        fields = ['contents']


class SectionSchemaSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = SectionSchema
        fields = ['year', 'contents']
