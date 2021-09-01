import django.contrib.postgres.fields.jsonb
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("carts_api", "0019_uploadedfiles"),
    ]

    operations = [
        migrations.CreateModel(
            name="FormTemplate",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("year", models.IntegerField()),
                ("section", models.IntegerField()),
                ("contents", django.contrib.postgres.fields.jsonb.JSONField()),
            ],
        ),
    ]
