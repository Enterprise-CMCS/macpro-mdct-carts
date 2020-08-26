from django.core import management  # type: ignore
from django.core.management.base import BaseCommand  # type: ignore
from json import loads
import jsonschema  # type: ignore
from pathlib import Path


class Command(BaseCommand):
    help = 'Imports base data.'

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
        sections = [loads(_.read_text())[0] for _ in paths]

        def validate(s, i):
            jsonschema.validate(schema=s, instance=i["fields"]["contents"])

        for section in sections:
            validate(schema, section)

        for path in paths:
            management.call_command("loaddata", path)
