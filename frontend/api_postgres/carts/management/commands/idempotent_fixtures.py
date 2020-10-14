from django.core import management  # type: ignore
from django.core.management.base import BaseCommand  # type: ignore
from carts.carts_api.models import (
    ACS,
    FMAP,
    Section,
    SectionBase,
    SectionSchema,
    State,
)

from json import loads
import jsonschema  # type: ignore
from pathlib import Path


class Command(BaseCommand):
    help = "".join(
        [
            "Imports base data, but doesn't overwrite existing ",
            "data unless --overwrite is present as a flag.",
        ]
    )

    def add_arguments(self, parser):
        # Named (optional) arguments
        parser.add_argument(
            "--overwrite",
            action="store_true",
            help="Overwrite existing instead of leaving as is",
        )

    def handle(self, *args, **options):
        fd = Path("fixtures")
        globs = ("states.json", "backend-j*.json", "2020-*.json", "acs.json")
        paths = []
        for glob in globs:
            paths = paths + [_ for _ in sorted(fd.glob(glob))]

        schemapath = Path(fd, "backend-section.schema.json")
        paths = paths + [schemapath]
        schemabase = loads(Path(fd, "backend-section.schema.json").read_text())
        schema = schemabase[0]["fields"]["contents"]

        overwrite = options.get("overwrite", False)

        def validate(s, i):
            jsonschema.validate(schema=s, instance=i["fields"]["contents"])

        paths_to_load = []

        for path in paths:
            fixture = loads(path.read_text())[0]
            is_new, validating = False, False
            if fixture["model"] == "carts_api.sectionschema":
                year = fixture["fields"]["year"]
                try:
                    existing = SectionSchema.objects.filter(year=year)
                    if overwrite:
                        existing.delete()
                        is_new = True
                except SectionSchema.DoesNotExist:
                    is_new = True
                validating = True
            elif fixture["model"] == "carts_api.sectionbase":
                year = fixture["fields"]["contents"]["section"].get("year")
                ordinal = fixture["fields"]["contents"]["section"].get(
                    "ordinal"
                )
                try:
                    existing = SectionBase.objects.filter(
                        contents__section__year=year,
                        contents__section__ordinal=ordinal,
                    )
                    if overwrite:
                        existing.delete()
                        is_new = True
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
                    "ordinal"
                )
                state = fixture["fields"]["contents"]["section"].get("state")
                try:
                    existing = Section.objects.filter(
                        contents__section__year=year,
                        contents__section__ordinal=ordinal,
                        contents__section__state=state,
                    )
                    if overwrite:
                        existing.delete()
                        is_new = True
                except Section.DoesNotExist:
                    is_new = True
                try:
                    validate(schema, fixture)
                    validating = True
                except jsonschema.exceptions.ValidationError:
                    print(path, "failed validation")
            elif fixture["model"] == "carts_api.State":
                State.objects.all().delete()
                # We have to put the state data at the start of the list
                # because the FMAP and ACS models have foreign keys that
                # require the state data to already be present.
                paths_to_load.insert(0, path)
                continue
            elif fixture["model"] == "carts_api.FMAP":
                # these are reference objects so we should be safe dumping all
                FMAP.objects.all().delete()
                paths_to_load.append(path)
                continue
            elif fixture["model"] == "carts_api.ACS":
                # these are reference objects so we should be safe dumping all
                ACS.objects.all().delete()
                paths_to_load.append(path)
            else:
                print("No match on model")
            if validating and is_new:
                paths_to_load.append(path)

        for i, path in enumerate(paths_to_load):
            print(i, path, flush=True)
            management.call_command("loaddata", path)
