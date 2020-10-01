import json
from django.contrib import admin
from django.contrib.postgres import fields
from django_json_widget.widgets import JSONEditorWidget

from carts.carts_api.models import (
    ACS,
    FMAP,
    AppUser,
    Section,
    SectionBase,
    SectionSchema,
    State,
)

# Register your models here.
admin.site.register(SectionSchema)
admin.site.register(ACS)
admin.site.register(FMAP)
admin.site.register(AppUser)
admin.site.register(State)


class SectionBaseAdmin(admin.ModelAdmin):
    list_display = ("section", "title", "year")

    def section(self, instance):
        return f'Section {instance.contents["section"]["ordinal"]}'

    def year(self, instance):
        return f'{instance.contents["section"]["year"]}'

    def title(self, instance):
        return f'{instance.contents["section"]["title"]}'

    formfield_overrides = {
        fields.JSONField: {"widget": JSONEditorWidget},
    }


admin.site.register(SectionBase, SectionBaseAdmin)


class SectionAdmin(admin.ModelAdmin):
    list_display = ("section", "year", "state", "title")

    def section(self, instance):
        return f'Section {instance.contents["section"]["ordinal"]}'

    def state(self, instance):
        return f'{instance.contents["section"]["state"]}'

    def title(self, instance):
        return f'{instance.contents["section"]["title"]}'

    def year(self, instance):
        return f'{instance.contents["section"]["year"]}'

    formfield_overrides = {
        fields.JSONField: {"widget": JSONEditorWidget},
    }


admin.site.register(Section, SectionAdmin)
