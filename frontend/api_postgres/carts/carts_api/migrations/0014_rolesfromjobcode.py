# Generated by Django 2.2.13 on 2020-10-15 20:36

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("carts_api", "0013_auto_20201013_2227"),
    ]

    operations = [
        migrations.CreateModel(
            name="RolesFromJobCode",
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
                ("job_code", models.CharField(max_length=64, unique=True)),
                (
                    "user_roles",
                    django.contrib.postgres.fields.ArrayField(
                        base_field=models.CharField(
                            choices=[
                                ("admin_user", "Admin User"),
                                ("bus_user", "Central Office Business Owner"),
                                ("co_user", "Central Office User"),
                                ("state_user", "State User"),
                                ("temp_user", "Temporary User"),
                            ],
                            max_length=64,
                        ),
                        size=None,
                    ),
                ),
            ],
        ),
    ]
