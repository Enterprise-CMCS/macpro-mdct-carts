import json
from django.contrib import admin
from django.contrib.postgres import fields
from django_json_widget.widgets import JSONEditorWidget

from carts.carts_api.models import Section, SectionBase, SectionSchema

# Register your models here.
admin.site.register(Section)
admin.site.register(SectionSchema)


class SectionBaseAdmin(admin.ModelAdmin):
    list_display = ("section", "title", "year")

    def section(self, instance):
        return f'Section {instance.contents["section"]["ordinal"]}'

    def year(self, instance):
        return f'{instance.contents["section"]["year"]}'

    def title(self, instance):
        return f'{instance.contents["section"]["title"]}'

    formfield_overrides = {
        fields.JSONField: {'widget': JSONEditorWidget},
    }


admin.site.register(SectionBase, SectionBaseAdmin)
