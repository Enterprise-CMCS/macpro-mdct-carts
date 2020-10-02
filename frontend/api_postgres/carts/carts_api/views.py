import json
import string
from typing import (
    Dict,
    List,
    Union,
)
from jwcrypto.jwk import JWK  # type: ignore
import python_jwt as jwt  # type: ignore
import requests

from django.contrib.auth.models import User, Group  # type: ignore
from django.db import transaction  # type: ignore
from django.http import HttpResponse, HttpResponseForbidden  # type: ignore
from django.template.loader import get_template  # type: ignore
from jsonpath_ng.ext import parse  # type: ignore
from jsonpath_ng import DatumInContext  # type: ignore
from rest_framework import viewsets  # type: ignore
from rest_framework.decorators import api_view  # type: ignore
from rest_framework.exceptions import ValidationError  # type: ignore
from rest_framework.response import Response  # type: ignore
from rest_framework.permissions import (  # type: ignore
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)
from carts.carts_api.serializers import (
    UserSerializer,
    GroupSerializer,
    SectionSerializer,
    SectionBaseSerializer,
    SectionSchemaSerializer,
    FMAPSerializer,
    StateSerializer,
)
from carts.carts_api.models import (
    Section,
    SectionBase,
    SectionSchema,
    FMAP,
    State,
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


class SectionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """

    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Section.objects.all()
    serializer_class = SectionSerializer

    def list(self, request):
        queryset = self.get_queryset()
        serializer = SectionSerializer(
            queryset, many=True, context={"request": request}
        )
        return Response(serializer.data)


@api_view(["GET"])
def sections_by_year_and_state(request, year, state):
    try:
        data = Section.objects.filter(
            contents__section__year=year,
            contents__section__state=state.upper(),
        )
    except Section.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == "GET":
        serializer = SectionSerializer(
            data, many=True, context={"request": request}
        )
        return Response(serializer.data)


@api_view(["POST"])
@transaction.atomic
def update_sections(request):
    try:

        for entry in request.data:
            section_id = entry["contents"]["section"]["id"]
            section_state = entry["contents"]["section"]["state"]

            section = Section.objects.get(
                contents__section__id=section_id,
                contents__section__state=section_state.upper(),
            )

            section.contents = entry["contents"]
            section.save()

    except:
        raise ValidationError(
            "There is a problem with the provided data.", 400
        )

    return HttpResponse(status=204)


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
    assert username
    assert "-" in username
    state_id = username.split("-")[1].upper()

    auth_group = Group.objects.get(
        name=f"Users who can edit and view {state_id} sections"
    )
    state = State.objects.get(code=state_id)
    assert auth_group and state
    program_names = ", ".join(state.program_names)
    program_name_text = f"{state.code.upper()} {program_names}"

    user_data = {
        "name": state.name,
        "abbr": state.code.upper(),
        "programType": state.program_type,
        "programName": program_name_text,
        "imageURI": f"/img/states/{state.code.lower()}.svg",
        "formName": "CARTS FY",
        "currentUser": {
            "role": "state_user",
            "state": {
                "id": state.code.upper(),
                "name": state.name,
            },
            "username": f"non-Okta-{state_id}",
            "email": f"dev-user@{state.name.lower()}.gov",
            "group": auth_group.name,
        },
    }

    return HttpResponse(json.dumps(user_data))


@api_view(["POST"])
def authenticate_user(request):
    # Extract token from header
    token_string = request.META.get("HTTP_AUTHORIZATION")
    token = token_string.split("Bearer ")[1]

    okta_host = "https://test.idp.idm.cms.gov"
    okta_root = "oauth2/aus4itu0feyg3RJTK297/v1"

    # Verify that this token really came from the Okta server.
    # TODO: Add error handling and pulling the URL from config.
    # u = "https://test.idp.idm.cms.gov/oauth2/aus4itu0feyg3RJTK297/v1/keys"
    is_valid_token = False
    pk_url = "/".join([okta_host, okta_root, "keys"])
    okta_auth_res = requests.get(pk_url)
    outer = okta_auth_res.json()
    keys = outer.get("keys")
    processed_jwt = jwt.process_jwt(token)

    # We should probably end up with only one key here, leaving as list for now
    fkeys = filter(lambda x: x["kid"] == processed_jwt[0]["kid"], keys)

    try:
        for key in fkeys:
            jwk = JWK.from_json(json.dumps(key))
            result = jwt.verify_jwt(
                token,
                jwk,
                ["RS256"],
                checks_optional=True,
            )
            if result:
                is_valid_token = True
            break
    except Exception:
        # TODO: better exception handling here
        return HttpResponseForbidden()

    if not is_valid_token:
        return HttpResponseForbidden()

    info_url = "/".join([okta_host, okta_root, "userinfo"])
    res = requests.get(info_url, headers={"Authorization": f"Bearer {token}"})
    userinfo = res.json()
    eua_id = userinfo.get("preferred_username")
    if not eua_id:
        return HttpResponseForbidden()

    email = userinfo.get("email", "no-eua-email@example.com")

    # Instead of a DB lookup, here we're just assigning one of the fake users
    # according to EUA ID.
    eua_ord = ord(eua_id[0]) % 3
    fake_user_map = {
        0: "AK",
        1: "AZ",
        2: "MA",
    }
    fake_user_key = fake_user_map[eua_ord]

    # Later we'll look up the user in the DB, but for the moment, assume
    # they're associated with the above state and grab the group for that
    # state's permissions:

    auth_group = Group.objects.get(
        name=f"Users who can edit and view {fake_user_key} sections"
    )
    state = State.objects.get(code=fake_user_key)
    assert auth_group and state
    program_names = ", ".join(state.program_names)
    program_name_text = f"{state.code.upper} {program_names}"

    user_data = {
        "name": state.name,
        "abbr": state.code.upper(),
        "programType": state.program_type,
        "programName": program_name_text,
        "imageURI": f"/img/states/{state.code.lower()}.svg",
        "formName": "CARTS FY",
        "currentUser": {
            "role": "state_user",
            "state": {
                "id": state.code.upper(),
                "name": state.name,
            },
            "username": eua_id,
            "email": email,
            "group": auth_group.name,
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
