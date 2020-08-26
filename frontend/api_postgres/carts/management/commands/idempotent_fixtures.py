from django.core import management  # type: ignore
from django.core.management.base import BaseCommand  # type: ignore
from carts.carts_api.models import Section, SectionBase, SectionSchema
from json import loads
import jsonschema  # type: ignore
from pathlib import Path


class Command(BaseCommand):
    help = "Imports base data, but doesn't overwrite existing data."

    def handle(self, *args, **options):
        fd = Path("fixtures")
        globs = ("backend-j*.json", "2020-*.json")
        paths = []
        for glob in globs:
            paths = paths + [_ for _ in fd.glob(glob)]

        schemapath = Path(fd, "backend-section.schema.json")
        paths = paths + [schemapath]
        schemabase = loads(Path(fd, "backend-section.schema.json").read_text())
        schema = schemabase[0]["fields"]["contents"]

        def validate(s, i):
            jsonschema.validate(schema=s, instance=i["fields"]["contents"])

        paths_to_load = []

        for path in paths:
            fixture = loads(path.read_text())[0]
            is_new, validating = False, False
            if fixture["model"] == "carts_api.sectionschema":
                year = fixture["fields"]["year"]
                try:
                    SectionSchema.objects.get(year=year)
                except SectionSchema.DoesNotExist:
                    is_new = True
                validating = True
            elif fixture["model"] == "carts_api.sectionbase":
                year = fixture["fields"]["contents"]["section"].get("year")
                ordinal = fixture["fields"]["contents"]["section"].get(
                    "ordinal")
                try:
                    SectionBase.objects.get(
                        contents__section__year=year,
                        contents__section__ordinal=ordinal)
                except SectionBase.DoesNotExist:
                    is_new = True
                try:
                    validate(schema, fixture)
                    validating = True
                except jsonschema.exceptions.ValidationError:
                    print(path, "failed validation")
            elif fixture["model"] == "carts_api.section":
                year = fixture["fields"]["contents"]["section"].get("year")
                ordinal = fixture["fields"]["contents"]["section"].get(
                    "ordinal")
                state = fixture["fields"]["contents"]["section"].get("state")
                try:
                    Section.objects.get(
                        contents__section__year=year,
                        contents__section__ordinal=ordinal,
                        contents__section__state=state)
                except Section.DoesNotExist:
                    is_new = True
                try:
                    validate(schema, fixture)
                    validating = True
                except jsonschema.exceptions.ValidationError:
                    print(path, "failed validation")
            else:
                print("No match on model")
            if validating and is_new:
                paths_to_load.append(path)

        for path in paths_to_load:
            management.call_command("loaddata", path)


