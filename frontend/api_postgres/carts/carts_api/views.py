import json
import string
from typing import (
    Dict,
    List,
    Union,
)

from datetime import datetime
from django.contrib.auth.models import User, Group  # type: ignore
from django.db import transaction  # type: ignore
from django.http import HttpResponse  # type: ignore
from django.template.loader import get_template  # type: ignore
from django.utils import timezone
from jsonpath_ng.ext import parse  # type: ignore
from jsonpath_ng import DatumInContext  # type: ignore
from rest_framework import viewsets  # type: ignore
from rest_framework.decorators import (  # type: ignore
    api_view,
)
from rest_framework.exceptions import (  # type: ignore
    PermissionDenied,
    ValidationError,
)
from rest_framework.response import Response  # type: ignore
from rest_framework.permissions import (  # type: ignore
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)
from carts.auth import JwtAuthentication
from carts.auth_dev import JwtDevAuthentication
from carts.permissions import (
    AdminHideRoleFromUsername,
    AdminHideRoleFromJobCode,
    AdminHideRolesFromJobCode,
    AdminHideStatesFromUsername,
    StateChangeSectionPermission,
    StateViewSectionPermission,
)
from carts.carts_api.serializers import (
    UserSerializer,
    GroupSerializer,
    RoleFromUsernameSerializer,
    RoleFromJobCodeSerializer,
    RolesFromJobCodeSerializer,
    SectionSerializer,
    SectionBaseSerializer,
    SectionSchemaSerializer,
    StateSerializer,
    StateStatusSerializer,
    StatesFromUsernameSerializer,
)
from carts.carts_api.models import (
    RoleFromUsername,
    RoleFromJobCode,
    RolesFromJobCode,
    Section,
    SectionBase,
    SectionSchema,
    State,
    StateStatus,
    StatesFromUsername,
)


# TODO: This should be absolutely stored elswhere.
STATE_INFO = {
    "AK": {"program_type": "medicaid_exp_chip"},
    "AZ": {"program_type": "separate_chip"},
    "MA": {"program_type": "combo"},
}


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    permission_classes = [IsAuthenticated]
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """

    permission_classes = [IsAuthenticated]
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class StateViewSet(viewsets.ModelViewSet):
    """
    API endpoint that returns state data.
    """

    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = State.objects.all()
    serializer_class = StateSerializer

    # def list(self, request):
    #    return Response(self.serializer_class(self.queryset).data)


class StatesFromUsernameViewSet(viewsets.ModelViewSet):
    """
    API endpoint for username–state associations.
    """

    permission_classes = [AdminHideStatesFromUsername]
    queryset = StatesFromUsername.objects.all()
    serializer_class = StatesFromUsernameSerializer

    def create(self, request):
        # We want there only to be one entry per username, and for the new
        # entry to overwrite.
        username = request.data.get("username")
        existing = StatesFromUsername.objects.filter(username=username)
        for relation in existing:
            relation.delete()
        return super().create(request)


class RoleFromUsernameViewSet(viewsets.ModelViewSet):
    """
    API endpoint for username–state associations.
    """

    permission_classes = [AdminHideRoleFromUsername]
    queryset = RoleFromUsername.objects.all()
    serializer_class = RoleFromUsernameSerializer

    def create(self, request):
        # We want there only to be one entry per username, and for the new
        # entry to overwrite.
        username = request.data.get("username")
        existing = RoleFromUsername.objects.filter(username=username)
        for relation in existing:
            relation.delete()
        return super().create(request)


class RoleFromJobCodeViewSet(viewsets.ModelViewSet):
    """
    API endpoint for username–state associations.
    """

    permission_classes = [AdminHideRoleFromJobCode]
    queryset = RoleFromJobCode.objects.all()
    serializer_class = RoleFromJobCodeSerializer

    def create(self, request):
        # We want there only to be one entry per job code, and for the new
        # entry to overwrite.
        job_code = request.data.get("job_code")
        existing = RoleFromJobCode.objects.filter(job_code=job_code)
        for relation in existing:
            relation.delete()
        return super().create(request)


class RolesFromJobCodeViewSet(viewsets.ModelViewSet):
    """
    API endpoint for username–state associations.
    """

    permission_classes = [AdminHideRolesFromJobCode]
    queryset = RolesFromJobCode.objects.all()
    serializer_class = RolesFromJobCodeSerializer

    def create(self, request):
        # We want there only to be one entry per job code, and for the new
        # entry to overwrite.
        job_code = request.data.get("job_code")
        existing = RolesFromJobCode.objects.filter(job_code=job_code)
        for relation in existing:
            relation.delete()
        return super().create(request)


class StateStatusViewSet(viewsets.ModelViewSet):
    """
    API endpoint for state status.
    """

    permission_classes = [
        StateViewSectionPermission,
        StateChangeSectionPermission,
    ]
    queryset = StateStatus.objects.all()
    serializer_class = StateStatusSerializer


class SectionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """

    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    permission_classes = [
        StateViewSectionPermission,
        StateChangeSectionPermission,
    ]

    def list(self, request):
        queryset = self.get_queryset()
        serializer = SectionSerializer(
            queryset, many=True, context={"request": request}
        )
        return Response(serializer.data)

    def get_sections_by_year_and_state(self, request, year, state):
        sections = self.get_queryset().filter(
            contents__section__year=year,
            contents__section__state=state.upper(),
        )

        for section in sections:
            # TODO: streamline this so if users have access to all of the
            # objects (e.g. if they're admins) the check occurs ony once.
            print("about to check object permissions", flush=True)
            self.check_object_permissions(request, section)

        serializer = SectionSerializer(
            sections, many=True, context={"request": request}
        )
        return Response(serializer.data)

    def get_section_by_year_and_state(self, request, year, state, section):
        section = Section.objects.get(
            contents__section__year=year,
            contents__section__state=state.upper(),
            contents__section__ordinal=section,
        )

        self.check_object_permissions(request, section)

        serializer = SectionSerializer(section, context={"request": request})
        return Response(serializer.data)

    @transaction.atomic
    def update_sections(self, request):
        try:
            state_id = False
            year = False

            for entry in request.data:
                section_id = entry["contents"]["section"]["id"]
                section_state = entry["contents"]["section"]["state"]
                state_id = section_state
                year = entry["contents"]["section"]["year"]

                section = Section.objects.get(
                    contents__section__id=section_id,
                    contents__section__state=section_state.upper(),
                )

                self.check_object_permissions(request, section)

                status = (
                    StateStatus.objects.all()
                    .filter(state_id=section_state, year=year)
                    .order_by("last_changed")
                    .last()
                )
                can_save = status == None or status.status not in [
                    "certified",
                    "published",
                    "approved",
                ]

                if can_save == False:
                    return HttpResponse(
                        f"cannot save {status} report", status=400
                    )

                section.contents = entry["contents"]
                section.save()

            status = (
                StateStatus.objects.all()
                .filter(state_id=section_state, year=year)
                .order_by("last_changed")
                .last()
            )
            status.last_changed = datetime.now(tz=timezone.utc)
            status.save()
            return HttpResponse(status=204)

        except PermissionDenied:
            raise
        except:
            raise ValidationError(
                "There is a problem with the provided data.", 400
            )

    def get_permissions(self):
        permission_classes_by_action = {
            "get_sections_by_year_and_state": [StateViewSectionPermission],
            "get_section_by_year_and_state": [StateViewSectionPermission],
            "update_sections": [
                StateViewSectionPermission,
                StateChangeSectionPermission,
            ],
        }

        try:
            return [
                permission()
                for permission in permission_classes_by_action[self.action]
            ]
        except:
            return [permission() for permission in self.permission_classes]


@api_view(["GET"])
def section_by_year_and_state(request, year, state, section):
    try:
        data = Section.objects.get(
            contents__section__year=year,
            contents__section__state=state.upper(),
            contents__section__ordinal=section,
        )
    except Section.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == "GET":
        serializer = SectionSerializer(data)
        return Response(serializer.data)


@api_view(["GET"])
def sectionbases_by_year(request, year):
    try:
        data = SectionBase.objects.filter(contents__section__year=year)
    except SectionBase.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == "GET":
        serializer = SectionBaseSerializer(
            data, many=True, context={"request": request}
        )
        return Response(serializer.data)


@api_view(["GET"])
def sectionbase_by_year_and_section(request, year, section):
    try:
        data = SectionBase.objects.get(
            contents__section__year=year, contents__section__ordinal=section
        )
    except SectionBase.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == "GET":
        serializer = SectionBaseSerializer(data)
        return Response(serializer.data)


@api_view(["GET"])
def sectionbase_by_year_section_subsection(request, year, section, subsection):
    try:
        data = SectionBase.objects.get(
            contents__section__year=year, contents__section__ordinal=section
        )
        subsection_id = _id_from_chunks(year, section, subsection)
        subsections = data.contents["section"]["subsections"]
        targets = [_ for _ in subsections if _["id"] == subsection_id]
        if not targets:
            return HttpResponse(status=404)
        data.contents = targets[0] if len(targets) == 1 else targets

    except SectionBase.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == "GET":
        serializer = SectionBaseSerializer(data)
        return Response(serializer.data)


@api_view(["GET"])
def section_subsection_by_year_and_state(
    request, year, state, section, subsection
):
    try:
        data = Section.objects.get(
            contents__section__year=year,
            contents__section__state=state.upper(),
            contents__section__ordinal=section,
        )
        subsections = data.contents["section"]["subsections"]
        subsection_id = _id_from_chunks(year, section, subsection)
        targets = [_ for _ in subsections if _["id"] == subsection_id]
        if not targets:
            return HttpResponse(status=404)
        data.contents = targets[0] if len(targets) == 1 else targets

    except Section.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == "GET":
        serializer = SectionSerializer(data)
        return Response(serializer.data)


@api_view(["GET"])
def fragment_by_year_state_id(request, state, id):
    try:
        year, section = _year_section_query_from_id(id)
        data = Section.objects.get(
            contents__section__year=year,
            contents__section__state=state.upper(),
            contents__section__ordinal=section,
        )
        targets = _get_fragment_by_id(id, data.contents.get("section"))
        if not len(targets) == 1:
            return HttpResponse(status=404)
        data.contents = targets[0].value

    except Section.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == "GET":
        serializer = SectionSerializer(data)
        return Response(serializer.data)


@api_view(["GET"])
def generic_fragment_by_id(request, id):
    try:
        year, section = _year_section_query_from_id(id)
        data = SectionBase.objects.get(
            contents__section__year=year, contents__section__ordinal=section
        )
        targets = _get_fragment_by_id(id, data.contents.get("section"))
        if not len(targets) == 1:
            return HttpResponse(status=404)
        data.contents = targets[0].value

    except Section.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == "GET":
        serializer = SectionBaseSerializer(data)
        return Response(serializer.data)


class SectionBaseViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """

    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = SectionBase.objects.all()
    serializer_class = SectionBaseSerializer


class SectionSchemaViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """

    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = SectionSchema.objects.all()
    serializer_class = SectionSchemaSerializer


def report(request, year=None, state=None):
    assert year
    assert state
    sections = Section.objects.filter(
        contents__section__year=year, contents__section__state=state.upper()
    )
    ordered = sorted(
        [_.contents["section"] for _ in sections], key=lambda s: s["ordinal"]
    )
    context = {
        "sections": ordered,
        "state": STATE_INFO[state.upper()],
        "l": len(ordered),
    }
    report_template = get_template("report.html")
    return HttpResponse(report_template.render(context=context))


def fake_user_data(request, username=None):  # pylint: disable=unused-argument
    jwt_auth = JwtDevAuthentication()
    user, _ = jwt_auth.authenticate(request, username=username)
    state = user.appuser.states.all()[0] if user.appuser.states.all() else []
    groups = ", ".join(user.groups.all().values_list("name", flat=True))

    program_names = ", ".join(state.program_names) if state else None
    program_text = f"{state.code.upper} {program_names}" if state else None

    user_data = {
        "name": state.name if state else None,
        "abbr": state.code.upper() if state else None,
        "programType": state.program_type if state else None,
        "programName": program_text,
        "formName": "CARTS FY",
        "currentUser": {
            "role": user.appuser.role,
            "firstname": user.first_name,
            "lastname": user.last_name,
            "state": {
                "id": state.code.upper() if state else None,
                "name": state.name if state else None,
            },
            "username": user.username,
            "email": user.email,
            "group": groups,
        },
    }

    return HttpResponse(json.dumps(user_data))


@api_view(["POST"])
def authenticate_user(request):
    user = request.user
    states = [*user.appuser.states.all()]
    groups = ", ".join(user.groups.all().values_list("name", flat=True))

    # The JS currently only knows how to handle one state per user, so:
    state = None
    if states:
        state = states[0]

    program_names = ", ".join(state.program_names) if state else None
    program_text = f"{state.code.upper} {program_names}" if state else None

    user_data = {
        "name": state.name if state else None,
        "abbr": state.code.upper() if state else None,
        "programType": state.program_type if state else None,
        "programName": program_text,
        "formName": "CARTS FY",
        "currentUser": {
            "role": user.appuser.role,
            "firstname": user.first_name,
            "lastname": user.last_name,
            "state": {
                "id": state.code.upper() if state else None,
                "name": state.name if state else None,
            },
            "username": user.username,
            "email": user.email,
            "group": groups,
        },
    }
    return HttpResponse(json.dumps(user_data))


def _id_from_chunks(year, *args):
    def fill(chunk):
        chunk = str(chunk).lower()
        if chunk in string.ascii_lowercase:
            return chunk
        return chunk.zfill(2)

    chunks = [year] + [*args]

    return "-".join(fill(c) for c in chunks)


def _year_section_query_from_id(ident: str) -> List[int]:
    return [int(_) for _ in ident.split("-")[:2]]


def _get_fragment_by_id(
    ident: str, contents: Union[Dict, List]
) -> DatumInContext:
    pathstring = f"$..*[?(@.id=='{ident}')]"
    find_by_id = parse(pathstring)
    return find_by_id.find(contents)
