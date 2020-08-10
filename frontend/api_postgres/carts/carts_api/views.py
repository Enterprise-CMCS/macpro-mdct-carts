import json
from django.contrib.auth.models import User, Group  # type: ignore
from django.http import HttpResponse  # type: ignore
from django.template.loader import get_template  # type: ignore
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
)
from carts.carts_api.models import (
    Section,
    SectionBase,
    SectionSchema,
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
def section_by_year_and_state(request, year, state):
    try:
        data = Section.objects.get(contents__section__year=year,
                                   contents__section__state=state.upper())
    except Section.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = SectionSerializer(data)
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
def sectionbase_subsection(request, subsection):
    year, section, subsection_letter = subsection.split("-")
    year, section = int(year), int(section)
    try:

        data = SectionBase.objects.get(contents__section__year=year,
                                       contents__section__ordinal=section)
        subsections = data.contents["section"]["subsections"]
        targets = [_ for _ in subsections if _["id"] == subsection]
        if len(targets) == 1:
            target = targets[0]
        else:
            target = targets
        data.contents = target
    except SectionBase.DoesNotExist:
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
