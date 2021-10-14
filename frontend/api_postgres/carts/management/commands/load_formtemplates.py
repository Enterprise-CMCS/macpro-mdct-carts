#
# Load initial form templates
#
import os
import sys
import csv
import json
from django.core import management  # type: ignore
from django.core.management.base import BaseCommand  # type: ignore
from carts.carts_api.models import (
    FormTemplate,
)

field_size_limit = sys.maxsize
csv.field_size_limit(field_size_limit)

from pathlib import Path


class Command(BaseCommand):
    def handle(self, *args, **options):

        formTemplateCsvfFile = "data/2021formtemplate.txt"

        try:
            FormTemplate.objects.all().delete()
            with open(formTemplateCsvfFile) as csv_file:
                csv_reader = csv.reader(csv_file, delimiter="\t")

                for row in csv_reader:
                    print(
                        f"New Form Template: Year= {row[1]} , Section = {row[2]}."
                    )

                    tmpJsonString = json.loads(row[3])

                    newTemplate = FormTemplate.objects.create(
                        id=row[0],
                        year=row[1],
                        section=row[2],
                        contents=tmpJsonString,
                    )
                    newTemplate.save()

        except:
            print("FormTemplate Load error")
