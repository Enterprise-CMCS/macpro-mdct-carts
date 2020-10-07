from json import loads
from pathlib import Path
from typing import Tuple, Union
from django.contrib.auth.models import (  # type: ignore
    Permission,
    Group,
)
from django.contrib.contenttypes.models import ContentType  # type: ignore
from django.core.management.base import BaseCommand  # type: ignore
from django.db.utils import IntegrityError  # type: ignore
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
        start_id = 100  # try starting here and see what happens
        for code in codes:
            new_perms, start_id = _create_permissions_for_state(
                code, start_id, section_model_id
            )
            for perm in new_perms:
                try:
                    new_perm = Permission.objects.create(**perm)
                    new_perm.save()
                except IntegrityError:
                    # This may get run multiple times, and if the permissions
                    # exist that's fine.
                    pass

        for code in codes:
            _create_change_view_group_for_state(code)


def _create_permissions_for_state(
    code: str, start_id: int, content_type: int
) -> Tuple[list, int]:
    def generate_perm(ident: int, term: str, ctype: int, state: str) -> dict:
        return {
            "id": ident,
            "content_type_id": ctype,
            "codename": f"{term}_state_{state.lower()}",
            "name": f"Can {term} {state.upper()} sections",
        }

    verbs = ("add", "change", "delete", "view")
    perms = []
    for i, verb in enumerate(verbs):
        perms.append(generate_perm(start_id + i, verb, content_type, code))

    return perms, start_id + len(verbs)


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


def _load_json(path: Path) -> Json:
    return loads(path.read_text())
