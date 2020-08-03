from django.contrib import admin
from carts.carts_api.models import Section, SectionBase, SectionSchema

# Register your models here.
admin.site.register(Section)
admin.site.register(SectionBase)
admin.site.register(SectionSchema)
