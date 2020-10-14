from django.conf import settings  # type: ignore
from django.db import migrations, models  # type: ignore
import django.db.models.deletion  # type: ignore


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("carts_api", "0007_auto_20201002_0510"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="appuser",
            name="email",
        ),
        migrations.RemoveField(
            model_name="appuser",
            name="username",
        ),
        migrations.AddField(
            model_name="appuser",
            name="user",
            field=models.OneToOneField(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="appuser",
            name="role",
            field=models.CharField(
                choices=[
                    ("admin_user", "Admin User"),
                    ("co_user", "Central Office User"),
                    ("state_user", "State User"),
                    ("temp_user", "Temporary User"),
                ],
                max_length=32,
            ),
        ),
    ]
