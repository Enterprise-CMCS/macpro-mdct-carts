from json import loads
from pathlib import Path
from typing import Union
from django.contrib.auth.models import (  # type: ignore
    Permission,
    Group,
)
from django.contrib.contenttypes.models import ContentType  # type: ignore
from django.core.management.base import BaseCommand  # type: ignore
from toolz import pluck  # type: ignore

Json = Union[dict, list]


class Command(BaseCommand):
    help = "Imports state permissions, including hard-coding their ids."

    def handle(self, *args, **options):  # pylint:disable=no-self-use
        print(args, options)
        fd = Path("fixtures")
        state_models = _load_json(fd / "states.json")
        codes = [*pluck("code", pluck("fields", state_models))]
        section_model = ContentType.objects.get(
            app_label="carts_api", model="section"
        )
        section_model_id = section_model.id
        for code in codes:
            new_perms = _create_permissions_for_state(code, section_model_id)
            for perm in new_perms:
                if Permission.objects.filter(**perm).count() == 0:
                    new_perm, _ = Permission.objects.get_or_create(**perm)
                    new_perm.save()

        for code in codes:
            _create_change_view_group_for_state(code)

        _create_permissions_for_admins()
        _create_permissions_for_co_users()
        _create_permissions_for_business_owners()


def _create_permissions_for_state(code: str, content_type: int) -> list:
    def generate_perm(term: str, ctype: int, state: str) -> dict:
        return {
            "content_type_id": ctype,
            "codename": f"{term}_state_{state.lower()}",
            "name": f"Can {term} {state.upper()} sections",
        }

    verbs = ("add", "change", "delete", "view")
    perms = []
    for verb in verbs:
        perms.append(generate_perm(verb, content_type, code))

    return perms


def _create_change_view_group_for_state(code: str) -> None:
    name = f"Users who can edit and view {code.upper()} sections"
    if Group.objects.filter(name=name).exists():
        return

    change_perm = Permission.objects.get(
        codename=f"change_state_{code.lower()}"
    )
    view_perm = Permission.objects.get(codename=f"view_state_{code.lower()}")
    assert change_perm and view_perm

    new_group = Group.objects.create(name=name)
    new_group.permissions.set([change_perm, view_perm])
    new_group.save()


def _create_permissions_for_admins() -> None:
    name = "Admin users"
    group, _ = Group.objects.get_or_create(name=name)

    verbs = ("add", "change", "delete", "view")
    models = (
        "appuser",
        "group",
        "logentry",
        "permission",
        "rolefromjobcode",
        "rolesfromjobcode",
        "rolefromusername",
        "session",
        "state",
        "statesfromusername",
        "user",
    )
    group_permissions = []

    for model in models:
        for verb in verbs:
            codename = f"{verb}_{model}"
            group_permissions.append(Permission.objects.get(codename=codename))

    group.permissions.set(group_permissions)
    group.save()


def _create_permissions_for_co_users() -> None:
    name = "CO users"
    group, _ = Group.objects.get_or_create(name=name)

    verbs = ("add", "change", "delete", "view")
    models = (
        "acs",
        "fmap",
        "section",
        "sectionbase",
        "sectionschema",
        "state",
    )
    group_permissions = []

    for model in models:
        for verb in verbs:
            codename = f"{verb}_{model}"
            group_permissions.append(Permission.objects.get(codename=codename))

    group.permissions.set(group_permissions)
    group.save()


def _create_permissions_for_business_owners() -> None:
    name = "Business owner users"
    group, _ = Group.objects.get_or_create(name=name)

    verbs = ("add", "change", "delete", "view")
    models = (
        "acs",
        "fmap",
        "section",
        "sectionbase",
        "sectionschema",
        "state",
    )
    group_permissions = []

    for model in models:
        for verb in verbs:
            codename = f"{verb}_{model}"
            group_permissions.append(Permission.objects.get(codename=codename))

    group.permissions.set(group_permissions)
    group.save()


def _load_json(path: Path) -> Json:
    return loads(path.read_text())
