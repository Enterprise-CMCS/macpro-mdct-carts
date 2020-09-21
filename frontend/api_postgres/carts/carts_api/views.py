import json
import string
from typing import (
    Dict,
    List,
    Union,
)
from django.contrib.auth.models import User, Group  # type: ignore
from django.http import HttpResponse  # type: ignore
from django.template.loader import get_template  # type: ignore
from jsonpath_ng.ext import parse  # type: ignore
from jsonpath_ng import DatumInContext  # type: ignore
from rest_framework import viewsets  # type: ignore
from rest_framework.decorators import api_view  # type: ignore
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
)
from carts.carts_api.models import (
    Section,
    SectionBase,
    SectionSchema,
    FMAP,
)


# TODO: This should be absolutely stored elswhere.
STATE_INFO = {
    "AK": {
        "program_type": "medicaid_exp_chip"
    },
    "AZ": {
        "program_type": "separate_chip"
    },
    "MA": {
        "program_type": "combo"
    },

}


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    permission_classes = [IsAuthenticated]
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class FMAPViewSet(viewsets.ModelViewSet):
    """
    API endpoint that returns FMAP percentages for each state.
    """
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = FMAP.objects.all()
    serializer_class = FMAPSerializer

    #def list(self, request):
    #    return Response(self.serializer_class(self.queryset).data)
@api_view(["GET"])
def fmap_by_state(request, state):
    """
    API endpoint that retrieves the FMAP for a single state
    """
    fmapdata = FMAP.objects.filter(state=state)
    serializer = FMAPSerializer(fmapdata, many=True)
    return Response(serializer.data)

class SectionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Section.objects.all()
    serializer_class = SectionSerializer

    def list(self, request):
        queryset = self.get_queryset()
        serializer = SectionSerializer(queryset, many=True,
                                       context={"request": request})
        return Response(serializer.data)


@api_view(["GET"])
def sections_by_year_and_state(request, year, state):
    try:
        data = Section.objects.filter(contents__section__year=year,
                                      contents__section__state=state.upper())
    except Section.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = SectionSerializer(data, many=True,
                                       context={"request": request})
        return Response(serializer.data)

@api_view(["POST"])
def temp_post_endpoint(request, year, state):
    return HttpResponse(status=204)

@api_view(["GET"])
def section_by_year_and_state(request, year, state, section):
    try:
        data = Section.objects.get(contents__section__year=year,
                                   contents__section__state=state.upper(),
                                   contents__section__ordinal=section)
    except Section.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = SectionSerializer(data)
        return Response(serializer.data)


@api_view(["GET"])
def sectionbases_by_year(request, year):
    try:
        data = SectionBase.objects.filter(contents__section__year=year)
    except SectionBase.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = SectionBaseSerializer(data, many=True,
                                           context={"request": request})
        return Response(serializer.data)


@api_view(["GET"])
def sectionbase_by_year_and_section(request, year, section):
    try:
        data = SectionBase.objects.get(contents__section__year=year,
                                       contents__section__ordinal=section)
    except SectionBase.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = SectionBaseSerializer(data)
        return Response(serializer.data)


@api_view(["GET"])
def sectionbase_by_year_section_subsection(request, year, section, subsection):
    try:
        data = SectionBase.objects.get(contents__section__year=year,
                                       contents__section__ordinal=section)
        subsection_id = _id_from_chunks(year, section, subsection)
        subsections = data.contents["section"]["subsections"]
        targets = [_ for _ in subsections if _["id"] == subsection_id]
        if not targets:
            return HttpResponse(status=404)
        data.contents = targets[0] if len(targets) == 1 else targets

    except SectionBase.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = SectionBaseSerializer(data)
        return Response(serializer.data)


@api_view(["GET"])
def section_subsection_by_year_and_state(request, year, state, section,
                                         subsection):
    try:
        data = Section.objects.get(contents__section__year=year,
                                   contents__section__state=state.upper(),
                                   contents__section__ordinal=section)
        subsections = data.contents["section"]["subsections"]
        subsection_id = _id_from_chunks(year, section, subsection)
        targets = [_ for _ in subsections if _["id"] == subsection_id]
        if not targets:
            return HttpResponse(status=404)
        data.contents = targets[0] if len(targets) == 1 else targets

    except Section.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = SectionSerializer(data)
        return Response(serializer.data)


@api_view(["GET"])
def fragment_by_year_state_id(request, state, id):
    try:
        year, section = _year_section_query_from_id(id)
        data = Section.objects.get(contents__section__year=year,
                                   contents__section__state=state.upper(),
                                   contents__section__ordinal=section)
        targets = _get_fragment_by_id(id, data.contents.get("section"))
        if not len(targets) == 1:
            return HttpResponse(status=404)
        data.contents = targets[0].value

    except Section.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = SectionSerializer(data)
        return Response(serializer.data)


@api_view(["GET"])
def generic_fragment_by_id(request, id):
    try:
        year, section = _year_section_query_from_id(id)
        data = SectionBase.objects.get(contents__section__year=year,
                                       contents__section__ordinal=section)
        targets = _get_fragment_by_id(id, data.contents.get("section"))
        if not len(targets) == 1:
            return HttpResponse(status=404)
        data.contents = targets[0].value

    except Section.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
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
    sections = Section.objects.filter(contents__section__year=year,
                                      contents__section__state=state.upper())
    ordered = sorted([_.contents["section"] for _ in sections],
                     key=lambda s: s["ordinal"])
    context = {
        "sections": ordered,
        "state": STATE_INFO[state.upper()],
        "l": len(ordered)
    }
    report_template = get_template("report.html")
    return HttpResponse(report_template.render(context=context))


def fake_user_data(request, username=None):
    assert username
    assert "-" in username
    state = username.split("-")[1].upper()

    host = request.get_host()
    scheme = "https" if request.is_secure() else "http"
    full_host = f"{scheme}://{host}"

    fakeUserData = {
        "AK": {
            "name": "Alaska",
            "abbr": "AK",
            "programType": "medicaid_exp_chip",
            "programName": "AK Program Name??",
            "imageURI": f"{full_host}/img/states/ak.svg",
            "formName": "CARTS FY",
            "currentUser": {
                "role": "state_user",
                "state": {
                    "id": "AK",
                    "name": "Alaska"
                },
                "username": "dev-jane.doe@alaska.gov",
            }
        },
        "AZ": {
            "name": "Arizona",
            "abbr": "AZ",
            "programType": "separate_chip",
            "programName": "AZ Program Name??",
            "imageURI": "{full_host}/img/states/az.svg",
            "formName": "CARTS FY",
            "currentUser": {
                "role": "state_user",
                "state": {
                    "id": "AZ",
                    "name": "Arizona"
                },
                "username": "dev-john.smith@arizona.gov",
            }
        },
        "MA": {
            "name": "Massachusetts",
            "abbr": "MA",
            "programType": "combo",
            "programName": "MA Program Name??",
            "imageURI": "${full_host}/img/states/ma.svg",
            "formName": "CARTS FY",
            "currentUser": {
                "role": "state_user",
                "state": {
                    "id": "MA",
                    "name": "Massachusetts"
                },
                "username": "dev-naoise.murphy@massachusetts.gov",
            }
        }
    }

    assert state in fakeUserData
    return HttpResponse(json.dumps(fakeUserData[state]))


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


def _get_fragment_by_id(ident: str,
                        contents: Union[Dict, List]) -> DatumInContext:
    pathstring = f"$..*[?(@.id=='{ident}')]"
    find_by_id = parse(pathstring)
    return find_by_id.find(contents)
