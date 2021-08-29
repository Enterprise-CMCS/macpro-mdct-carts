import json
import string
from django.core import serializers
from typing import (
    Dict,
    List,
    Union,
)
import boto3
from botocore.config import Config
import os
import random
import base64
import pdfkit

from zipfile import ZipFile

from datetime import datetime
from django.contrib.auth.models import User, Group  # type: ignore
from django.db.models import Q
from smtplib import SMTPException
from django.db import transaction  # type: ignore
from django.http import HttpResponse, JsonResponse  # type: ignore
from django.template.loader import get_template, render_to_string  # type: ignore
from django.utils import timezone  # type: ignore
from django.core.mail import send_mail, send_mass_mail
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
    AllowAny,
)
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
    FormTemplateSerializer,
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
    FormTemplate,
    RoleFromUsername,
    RoleFromJobCode,
    RolesFromJobCode,
    Section,
    SectionBase,
    SectionSchema,
    State,
    StateStatus,
    StatesFromUsername,
    UserProfiles,
    UploadedFiles,
)
from carts.carts_api.model_utils import validate_status_change

from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.csrf import ensure_csrf_cookie

from django.core.serializers.json import DjangoJSONEncoder

# TODO: This should be absolutely stored elswhere.
STATE_INFO = {
    "AK": {"program_type": "medicaid_exp_chip"},
    "AZ": {"program_type": "separate_chip"},
    "MA": {"program_type": "combo"},
}



class FormTemplateViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows FormTemplates to be viewed or edited.
    """

    queryset = FormTemplate.objects.all()
    serializer_class = FormTemplateSerializer
    permission_classes = [
        StateViewSectionPermission,
        StateChangeSectionPermission,
    ]

    def list(self, request):
        queryset = self.get_queryset()
        serializer = FormTemplateSerializer(
            queryset, many=True, context={"request": request}
        )
        return Response(serializer.data)

    def create(self, request):
        # We want there only to be one entry per year and section, and for the new
        # entry to overwrite.
        year = request.data.get("year")
        section = request.data.get("section")
        existing = FormTemplate.objects.filter(year=year, section=section)
        for relation in existing:
            relation.delete()
        return super().create(request)

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

# Function to convert
def listToString(s):

    # initialize an empty string
    str1 = ""

    # traverse in the string
    for ele in s:
        str1 += ele

    # return string
    return str1

@api_view(["POST"])
def update_formtemplates_by_year(request):

   year=int(request.data.get("year"))
   templateArr = []
   global newSectionContents
   global debugThis
   #
   #  Update Year State Status
   #
   allUsers = StateStatus.objects.all()
   for newStateStatus in allUsers.iterator():
       try:
         stateExists = StateStatus.objects.filter(state=newStateStatus.state_id, year=year)
         if len(stateExists) == 0:
           createdStateStatus = StateStatus.objects.create(year=year,state_id=newStateStatus.state_id, user_name=newStateStatus.user_name, last_changed=datetime.now(tz=timezone.utc))
           createdStateStatus.save()
         else:
           print("Warning: Ignore create - State Status - Already Exists")

       except:
         print("WARNING: StateStatus Create Failed for user: " + newStateStatus.user_name + " and State Code: " + newStateStatus.state_id +  " and Year: " + str(year))

   #
   #  Update Section List with not_started
   #

   existsAlready = list(Section.objects.filter(contents__section__year = year))
   if (len(existsAlready) == 0):
     currentSectionsByYear = list(Section.objects.filter(contents__section__year = year - 1))
     for currentSection in currentSectionsByYear:

       tmpJson = json.dumps(currentSection.contents)
       tmpContents = str(tmpJson).replace(str(year+1),str(year+2)).replace(str(year),str(year+1)).replace(str(year-1),str(year)).replace("'","&#8218;")
       newContents = json.loads(tmpContents)
       #
       #  Name Section
       #
       try:

             updated = Section.objects.create(contents=newContents)
             updated.save()

       except:

           return HttpResponse(json.dumps("{'ERROR: -> Section_Create_ERROR_008': 'update_formtemplates_by_year' }", cls=DjangoJSONEncoder))


   return HttpResponse(json.dumps("{'SUCCESS':'update_formtemplates_by_year'}", cls=DjangoJSONEncoder))

@api_view(["GET"])
def get_formtemplates_by_year(request, year):

    formtemplates = list(FormTemplate.objects.filter(year = year).order_by("section"))

    return HttpResponse(json.dumps(formtemplates, cls=DjangoJSONEncoder))


@api_view(["GET"])
def get_formtemplate_by_year_and_section(self, request, year, section):
    formtemplate = list(FormTemplate.objects.filter(year = year).first().values())

    return HttpResponse(json.dumps(formtemplate, cls=DjangoJSONEncoder))

@api_view(["POST"])
def update_formtemplate(self, request, year, section):
    try:
        section = False
        year = False

        for entry in request.data:
            section_id = entry["contents"]["section"]["id"]
            template_state = "AA"
            state_id = template_state
            year = entry["contents"]["section"]["year"]

            formtemplate = FormTemplate.objects.get(
                section=section_id,
                year=year,
            )

            self.check_object_permissions(request, section)

            status = (
                StateStatus.objects.all()
                .filter(state_id=state_id, year=year)
                .order_by("last_changed")
                .last()
            )
            can_save = status is None or status.status not in [
                "certified",
                "published",
                "accepted",
            ]

            if request.user.appuser.role != "state_user":
                can_save = False

            if not can_save:
                return HttpResponse(
                    f"cannot save {status} report", status=400
                )

            formtemplate.contents = entry["contents"]
            formtemplate.save()

        status = (
            StateStatus.objects.all()
            .filter(state_id=template_state, year=year)
            .order_by("last_changed")
            .last()
        )

        if status.status == "in_progress":
            status.last_changed = datetime.now(tz=timezone.utc)
            status.save()
        else:
            # if the form is being changed, it must be in progress:
            state = State.objects.get(code=template_state.upper())
            updated = StateStatus.objects.create(
                state=None,
                year=year,
                status="in_progress",
                last_changed=datetime.now(tz=timezone.utc),
                user_name=request.user.username,
            )
            updated.save()

        return HttpResponse(status=204)

    except PermissionDenied:
        raise
    except Exception as e:
        raise ValidationError(
            "There is a problem with the provided data.", 400
        ) from e


























class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    permission_classes = [IsAuthenticated]
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer


@api_view(["POST"])
def UserProfilesViewSet(request):
    """
    API endpoint that returns all user profile data.
    """

    # Get all users
    users = list(UserProfiles.objects.all().order_by("username").values())

    return HttpResponse(json.dumps(users, cls=DjangoJSONEncoder))


class GroupViewSet(viewsets.ReadOnlyModelViewSet):
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

    def create(self, request):
        """
        The object being created here is the newest status for a given
        state/year.
        We expect the post request to have state, year, and status; we get the
        user from request.user and we update last_changed ourselves.
        We've had some confusion over whether or not the name for a form in
        progress is "in progress" or "started", so we accommodate both below
        and turn the latter into the former.
        """
        state_code = request.data.get("state")
        year = request.data.get("year")
        new_status = request.data.get("status")
        if new_status == "started":
            new_status = "in_progress"
        user = request.user
        try:
            assert all([state_code, year, new_status, user])
        except AssertionError:
            return HttpResponse(
                "state_code, year, status, or user missing", status=400
            )
        state = State.objects.get(code=state_code.upper())
        current = (
            StateStatus.objects.all()
            .filter(state_id=state_code.upper(), year=year)
            .order_by("last_changed")
            .last()
        )
        current_status = current.status if current else "not_started"
        if current_status == new_status:
            return self.list(request)
        if current_status == "started":
            current_status = "in_progress"
        is_change_valid = validate_status_change(
            user.appuser.role, current_status, new_status
        )
        if is_change_valid.update_success:
            updated = StateStatus.objects.create(
                state=state,
                year=year,
                status=is_change_valid.new_status,
                last_changed=datetime.now(tz=timezone.utc),
                user_name=user.username,
            )
            updated.save()
            """
            The "submitted" state is transitory and we should probably get rid
            of it, but while it exists, it exists only to be immediately turned
            into "certified":
            """
            if updated.status == "submitted":
                certified = StateStatus.objects.create(
                    state=state,
                    year=year,
                    status="certified",
                    last_changed=datetime.now(tz=timezone.utc),
                    user_name=user.username,
                )
                certified.save()

            return self.list(request)

        return HttpResponse(is_change_valid.message, status=400)

    def get_queryset(self):
        user = self.request.user
        if user.appuser.role == "state_user":
            state = user.appuser.states.all()[0]
            return StateStatus.objects.filter(state=state)
        elif user.appuser.role in ("bus_user", "co_user", "admin_user"):
            return StateStatus.objects.all()


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
            # print("about to check object permissions", flush=True)
            if request.user.appuser.role != "admin_user":
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

    transaction.atomic

    def update_sections(self, request):
        try:
            state_id = False
            year = False

            for entry in request.data:
                section_id = entry["contents"]["section"]["id"]
                section_state = entry["contents"]["section"]["state"]
                state_id = section_state.upper()
                year = entry["contents"]["section"]["year"]

                section = Section.objects.get(
                    contents__section__id=section_id,
                    contents__section__state=section_state.upper(),
                )

                self.check_object_permissions(request, section)

                status = (
                    StateStatus.objects.all()
                    .filter(state_id=state_id, year=year)
                    .order_by("last_changed")
                    .last()
                )
                can_save = status is None or status.status not in [
                    "certified",
                    "published",
                    "accepted",
                ]

                if request.user.appuser.role != "state_user":
                    can_save = False

                if not can_save:
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

            if status.status == "in_progress":
                status.last_changed = datetime.now(tz=timezone.utc)
                status.save()
            else:
                # if the form is being changed, it must be in progress:
                state = State.objects.get(code=section_state.upper())
                updated = StateStatus.objects.create(
                    state=state,
                    year=year,
                    status="in_progress",
                    last_changed=datetime.now(tz=timezone.utc),
                    user_name=request.user.username,
                )
                updated.save()

            return HttpResponse(status=204)

        except PermissionDenied:
            raise
        except Exception as e:
            raise ValidationError(
                "There is a problem with the provided data.", 400
            ) from e

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

    def create(self, request):
            # We want there only to be one entry per username, and for the new
            # entry to overwrite.
            contents = request.data.get("contents")
            existing = StatesFromUsername.objects.filter(contents=contents)
            for relation in existing:
                relation.delete()
            return super().create(request)


@api_view(["GET"])
def GetUser(request, id=None):
    """
    API endpoint for retrieving user info
    """
    assert id

    try:
        result = list(UserProfiles.objects.all().filter(id=id).values())
    except ObjectDoesNotExist:
        logging.error("User does not exist")

    if result:
        response = HttpResponse(json.dumps(result, cls=DjangoJSONEncoder))
    else:
        response = JsonResponse(
            {"status": "false", "message": "User Not Found"}, status=500
        )

    return response


@api_view(["GET"])
def AddUser(request, eua_id=None, state_code=None, role=None):
    """
    API endpoint for creating a state user.
    """
    assert eua_id
    assert state_code
    assert role

    result = HttpResponse()

    try:

        current = (
            StatesFromUsername.objects.all()
            .filter(username=eua_id.upper())
            .last()
        )

        if current is not None:
            print(f"\n\n\n User exists")
            result.content = "User already exists"
            result.status_code = 200

        else:
            """
            The objects being created here is a new state via username and
            role via username.
            We expect the post request to have state and username.
            """

            # Create array from hyphen separated list
            state_codes_array = state_code.split("-")

            # Convert all to uppercase
            state_codes_upper = [x.upper() for x in state_codes_array]

            # Alphabetize
            state_codes_refined = sorted(state_codes_upper)

            newStateUser = StatesFromUsername.objects.create(
                username=str(eua_id.upper()), state_codes=state_codes_refined
            )
            newRole = RoleFromUsername.objects.create(
                user_role=role, username=eua_id.upper()
            )
            result.content = "State user sucessfully added"
            result.status_code = 200

    except:
        result.content = (
            "Failed to add a new state user. Please contact the help desk."
        )
        result.status_code = 500
    # Note there is no .save() and it still saves to the db

    return result


@api_view(["GET"])
def UpdateUser(request, id=None, state_codes=None, role=None, is_active=None):
    assert id
    assert state_codes
    assert role
    assert is_active

    response = ""

    ### Update auth_user table
    try:
        # Get user from auth_user table
        user = User.objects.get(id=id)

        # update is_active status
        user.is_active = False
        if is_active.lower() == "true":
            user.is_active = True

        # Save user data
        user.save()
    except:
        response = JsonResponse(
            {"status": "false", "message": "User Not Found"}, status=500
        )

    ### Update rolefromusername
    try:

        # Get user from rolefromusername table
        userRole = RoleFromUsername.objects.get(username=user.username)
    except:
        userRole = False

    if userRole:
        # Set role
        userRole.user_role = role.lower()

        # Save
        userRole.save()
    else:
        RoleFromUsername.objects.create(
            user_role=role, username=user.username.upper()
        )

    ### Update statesfromusername
    try:
        userStates = StatesFromUsername.objects.filter(
            username=user.username
        ).last()
    except:
        userStates = False

    if state_codes == "null":
        state_codes_refined = "{}"
    else:
        # Create array from hyphen separated list
        state_codes_array = state_codes.split("-")

        # Convert all to uppercase
        state_codes_upper = [x.upper() for x in state_codes_array]

        # Alphabetize
        state_codes_refined = sorted(state_codes_upper)

    if userStates:
        # Update states
        userStates.state_codes = state_codes_refined
        userStates.save()
    else:
        StatesFromUsername.objects.create(
            username=user.username, state_codes=state_codes_refined
        )

    if response == "":
        response = JsonResponse(
            {"status": "true", "message": "User Updated"}, status=200
        )

    return response


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


@api_view(["POST"])
def UserActivateViewSet(request, user=None):
    # Get user
    current = User.objects.get(username=user)
    current.is_active = True
    current.save()

    return HttpResponse("Activated User")


@api_view(["POST"])
def UserDeactivateViewSet(request, user=None):
    # Get user
    current = User.objects.get(username=user)
    current.is_active = False
    current.save()

    return HttpResponse("Deactivated User")


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


@csrf_exempt
@ensure_csrf_cookie
def initiate_session(request):
    print(f"\n\n\n!!!!!!!!!!!!!!!initiating session")
    resultJson = {"transaction_result": "success"}

    return HttpResponse(json.dumps(resultJson))


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


@api_view(["POST"])
def generate_upload_psurl(request):
    file = request.data["uploadedFileName"]

    # current pattern for aws filename alias is userid_0000000_YYYYMMDD_H_M_S_filename
    # that should yield enough entropy to never incur a collision
    aws_filename = (
        f"{request.user}_"
        + str(random.randint(100, 100000)).zfill(7)
        + "_"
        + datetime.now().strftime("%Y%m%d_%H%M%S")
        + f"_{file}"
    )

    user_state = StatesFromUsername.objects.filter(
        username=request.user
    ).values_list("state_codes", flat=True)[0][0]

    uploadedFile = UploadedFiles.objects.create(
        uploaded_username=f"{request.user}",
        question_id=request.data["questionId"],
        filename=file,
        aws_filename=aws_filename,
        uploaded_state=user_state,
    )

    uploadedFile.save()

    s3_bucket = os.environ.get("S3_UPLOADS_BUCKET_NAME")
    region = os.environ.get("AWS_REGION")
    session = boto3.session.Session()
    s3 = session.client("s3", f"{region}")

    # Generate the URL to get 'key-name' from 'bucket-name'
    parts = s3.generate_presigned_post(
        Bucket=f"{s3_bucket}", Key=f"{aws_filename}"
    )

    generated_presigned_url = {
        "psurl": parts["url"],
        "psdata": parts["fields"],
    }

    return HttpResponse(json.dumps(generated_presigned_url))


@api_view(["POST"])
def generate_download_psurl(request):
    aws_filename = request.data["awsFilename"]
    filename = request.data["filename"]
    s3_bucket = os.environ.get("S3_UPLOADS_BUCKET_NAME")
    region = os.environ.get("AWS_REGION")
    session = boto3.session.Session()
    s3 = session.client("s3", f"{region}")
    print(f"generating url")
    presigned_url = s3.generate_presigned_url(
        "get_object",
        Params={
            "Bucket": s3_bucket,
            "Key": aws_filename,
            "ResponseContentDisposition": f"attachment; filename = {filename}",
        },
        ExpiresIn=3600,
    )
    print(f"!!!!!DONE!!!!!")
    generated_presigned_url = {"psurl": presigned_url}

    return HttpResponse(json.dumps(generated_presigned_url))


@api_view(["POST"])
def view_uploaded_files(request):
    user_state = StatesFromUsername.objects.filter(
        username=request.user
    ).values_list("state_codes", flat=True)[0][0]
    uploaded_files = UploadedFiles.objects.filter(
        uploaded_username=request.user,
        uploaded_state=user_state,
        question_id=request.data["questionId"],
    ).values("filename", "aws_filename")

    uploaded_file_list = []

    for file in uploaded_files:
        uploaded_file_list.append(f"{file}")

    uploadedFiles = {"uploaded_files": uploaded_file_list}

    return HttpResponse(json.dumps(uploadedFiles))


@api_view(["POST"])
def remove_uploaded_files(request):
    aws_filename = request.data["awsFilename"]

    user_state = StatesFromUsername.objects.filter(
        username=request.user
    ).values_list("state_codes", flat=True)[0][0]

    UploadedFiles.objects.filter(
        uploaded_state=user_state,
        aws_filename=request.data["awsFilename"],
    ).delete()

    s3_bucket = os.environ.get("S3_UPLOADS_BUCKET_NAME")
    region = os.environ.get("AWS_REGION")
    session = boto3.session.Session()
    s3 = session.client("s3", f"{region}")
    response = s3.delete_object(Bucket=f"{s3_bucket}", Key=f"{aws_filename}")

    print(f"\n\n\n\n~~~~~~~~deleted")

    response = {"success": "true"}

    return HttpResponse(json.dumps(response))


@api_view(["POST"])
def SendEmail(request):
    if "recipients" in request.data:
        # Expects comma separated list
        recipients = request.data["recipients"].replace(" ", "").split(",")
    else:
        recipients = None

    if "subject" in request.data:
        subject = request.data["subject"]
    else:
        subject = None

    if "message" in request.data:
        message = request.data["message"]
    else:
        message = None

    if "sender" in request.data:
        sender = request.data["sender"]
    else:
        sender = '"CMS MDCT CARTS" <carts_noreply@cms.hss.gov>'

    responseMessage = ""
    # Exists checks for all
    if recipients is None:
        responseMessage += "Missing require data: recipients \n"
    if not isinstance(recipients, list):
        responseMessage += "Invalid type: recipients must be list/array \n"
    if subject is None:
        responseMessage += "Missing require data: subject \n"
    if message is None:
        responseMessage += "Missing require data: message \n"

    if responseMessage is "":
        try:
            send_mail(subject, message, sender, recipients)
            jsonResponse = JsonResponse(
                {"status": "true", "message": "Emails successfully sent"},
                status=200,
            )
        except:
            jsonResponse = JsonResponse(
                {"status": "false", "message": "Could not send email"},
                status=500,
            )

    else:
        jsonResponse = JsonResponse(
            {"status": "false", "message": responseMessage}, status=422
        )
    return jsonResponse


@api_view(["POST"])
def SendEmailStatusChange(request):
    # Disallow if not in Dev or Prod environments
    if (
        os.environ.get("ENVIRONMENT")
        != "dev"
        # 1/4/2021: commenting out PROD for the moment since SES service has not been fully configured so emails cannot be sent
        # and os.environ.get("ENVIRONMENT") != "prod"
    ):
        return JsonResponse(
            {
                "status": "false",
                "message": "Could not send email from this environment",
            },
            status=501,
        )

    if "subject" in request.data:
        # Email subject
        subject = request.data["subject"]
    else:
        subject = None

    if "status" in request.data:
        # Certify or Uncertify
        status = request.data["status"]
    else:
        status = None

    if "source" in request.data:
        # Hostname, eg https://mdctcarts.cms.gov
        source = request.data["source"]
    else:
        source = None

    if "sender" in request.data:
        # String: email of sender
        sender = request.data["sender"]
    else:
        sender = '"CMS MDCT CARTS" <carts_noreply@cms.hss.gov>'

    if "statecode" not in request.data:
        # State abbreviation
        statecode = None
    else:
        statecode = request.data["statecode"]

        # Set recipients from statecode
        users = _getUsersForStatusChange(statecode)

        recipients = []
        for user in users:
            recipients.append(user.email)

    responseMessage = ""
    # Exists checks for all that are needed
    if subject is None:
        responseMessage += "Missing require data: subject \n"
    if statecode is None:
        responseMessage += "Missing require data: statecode \n"
    if status is None:
        responseMessage += "Missing require data: status \n"
    if source is None:
        responseMessage += "Missing require data: source \n"

    if responseMessage is "":

        try:
            subject = "CMS MDCT CARTS"

            msg_plain = render_to_string(
                "../templates/emails/status-change.txt",
                {
                    "statecode": statecode,
                    "status": status.capitalize(),
                    "source": source,
                },
            )
            msg_html = render_to_string(
                "../templates/emails/status-change.html",
                {
                    "statecode": statecode,
                    "status": status.capitalize(),
                    "source": source,
                },
            )

            # For each email in recipients, send mail with plain and html versions
            for recipient in recipients:
                send_mail(
                    subject,
                    msg_plain,
                    sender,
                    [recipient],
                    html_message=msg_html,
                    fail_silently=False,
                )

            jsonResponse = JsonResponse(
                {"status": "true", "message": "Update successful"}, status=200
            )
        except Exception as e:
            print("Email error: ", e)
            jsonResponse = JsonResponse(
                {"status": "false", "message": "Could not send email"},
                status=501,
            )

    else:
        jsonResponse = JsonResponse(
            {"status": "false", "message": responseMessage}, status=422
        )
    return jsonResponse


def _getUsersForStatusChange(statecode):
    """ Get all users who recieve email updates from statusChange """
    try:
        users = UserProfiles.objects.all().filter(
            Q(is_active=True),
            Q(user_role="co_user")
            | Q(user_role="bus_user")
            | (
                Q(user_role="state_user") & Q(state_codes__icontains=statecode)
            ),
        )

    except Exception as e:
        print(e)
    return users


@api_view(["POST"])
def download_template(request):

    options = {
        "page-size": "A4",
        "margin-top": "0.75in",
        "margin-right": "0.75in",
        "margin-bottom": "0.75in",
        "margin-left": "0.75in",
        "encoding": "UTF-8",
    }

    state = request.data.get("tempState")
    year = int(request.data.get("currentYear"))

    today = datetime.now()
    pdf_filename = f"template" + today.strftime("%d_%m_%Y %H_%M_%S") + ".pdf"
    zip_filename = f"template" + today.strftime("%d_%m_%Y %H_%M_%S") + ".zip"

    sections = Section.objects.all().filter(
        contents__section__year=year,
        contents__section__state=state,
    )

    ordered = sorted(
        [_.contents["section"] for _ in sections], key=lambda s: s["ordinal"]
    )
    template = get_template("../templates/report.html")
    # Pulling out the program type here
    temp_program_type = str(ordered[0]).split(
        "'2020-00-a-01-02', 'type': 'radio', 'label': 'Program type:', 'answer': {'entry':"
    )[1]
    program_type = (
        temp_program_type.split(
            ", 'options': [{'label': 'Both Medicaid Expansion CHIP and Separate CHIP'"
        )[0]
        .replace("'", "")
        .replace(" ", "")
    )

    # saving synthesized table values
    temp_question = str(ordered[3]).split("{'id': '2020-03-c-02-01', 'hint':")[
        1
    ]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_03_c_02_01 = temp_answer.split("}},")[0].replace("'", "")

    temp_question = str(ordered[3]).split("{'id': '2020-03-c-02-02', 'hint':")[
        1
    ]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_03_c_02_02 = temp_answer.split("}},")[0].replace("'", "")

    temp_question = str(ordered[3]).split("{'id': '2020-03-c-02-03', 'hint':")[
        1
    ]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_03_c_02_03 = temp_answer.split("},")[0].replace("'", "")

    temp_question = str(ordered[3]).split("{'id': '2020-03-c-02-04', 'type'")[
        1
    ]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_03_c_02_04 = temp_answer.split("}},")[0].replace("'", "")

    temp_question = str(ordered[3]).split("{'id': '2020-03-c-03-02', 'type':")[
        1
    ]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_03_c_03_02 = temp_answer.split("}},")[0].replace("'", "")

    temp_question = str(ordered[3]).split("{'id': '2020-03-c-03-03', 'type':")[
        1
    ]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_03_c_03_03 = temp_answer.split("}},")[0].replace("'", "")

    temp_question = str(ordered[3]).split("{'id': '2020-03-c-03-04', 'hint':")[
        1
    ]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_03_c_03_04 = temp_answer.split("},")[0].replace("'", "")

    temp_question = str(ordered[3]).split(
        "{'id': '2020-03-c-03-04-a', 'hint':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_03_c_03_04_a = temp_answer.split("}},")[0].replace("'", "")

    temp_question = str(ordered[3]).split(
        "{'id': '2020-03-c-03-04-b', 'hint':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_03_c_03_04_b = temp_answer.split("}},")[0].replace("'", "")

    temp_question = str(ordered[3]).split(
        "{'id': '2020-03-c-03-04-c', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_03_c_03_04_c = temp_answer.split("}}]},")[0].replace("'", "")

    temp_question = str(ordered[3]).split("{'id': '2020-03-c-04-02', 'type':")[
        1
    ]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_03_c_04_02 = temp_answer.split("}},")[0].replace("'", "")

    temp_question = str(ordered[3]).split("{'id': '2020-03-c-04-03', 'type':")[
        1
    ]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_03_c_04_03 = temp_answer.split("}},")[0].replace("'", "")

    temp_question = str(ordered[3]).split("{'id': '2020-03-c-04-04', 'hint':")[
        1
    ]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_03_c_04_04 = temp_answer.split("},")[0].replace("'", "")

    temp_question = str(ordered[3]).split(
        "{'id': '2020-03-c-04-04-a', 'hint':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_03_c_04_04_a = temp_answer.split("}},")[0].replace("'", "")

    temp_question = str(ordered[3]).split(
        "{'id': '2020-03-c-04-04-b', 'hint':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_03_c_04_04_b = temp_answer.split("}},")[0].replace("'", "")

    temp_question = str(ordered[3]).split(
        "{'id': '2020-03-c-04-04-c', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_03_c_04_04_c = temp_answer.split("}}]},")[0].replace("'", "")

    temp_question = str(ordered[3]).split("{'id': '2020-03-e-02-08', 'type':")[
        1
    ]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_03_e_02_08 = temp_answer.split("}},")[0].replace("'", "")

    temp_question = str(ordered[3]).split("{'id': '2020-03-e-02-09', 'type':")[
        1
    ]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_03_e_02_09 = temp_answer.split("}},")[0].replace("'", "")

    temp_question = str(ordered[3]).split("{'id': '2020-03-e-02-10', 'type':")[
        1
    ]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_03_e_02_10 = temp_answer.split("}}]},")[0].replace("'", "")

    temp_question = str(ordered[3]).split(
        "{'id': '2020-03-g-01-07-a', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_03_g_01_07_a = temp_answer.split("}},")[0].replace("'", "")

    temp_question = str(ordered[3]).split(
        "{'id': '2020-03-g-01-07-b', 'hint':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_03_g_01_07_b = temp_answer.split("}},")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-01-01-a', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_01_01_a = temp_answer.split("},")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-01-01-b', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_01_01_b = temp_answer.split("}},")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-01-01-c', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_01_01_c = temp_answer.split("}}],")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-01-02-a', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_01_02_a = temp_answer.split("},")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-01-02-b', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_01_02_b = temp_answer.split("}},")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-01-02-c', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_01_02_c = temp_answer.split("}}],")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-01-03-a', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_01_03_a = temp_answer.split("},")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-01-03-b', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_01_03_b = temp_answer.split("}},")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-01-03-c', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_01_03_c = temp_answer.split("}}],")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-01-04-a', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_01_04_a = temp_answer.split("},")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-01-04-b', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_01_04_b = temp_answer.split("}},")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-01-04-c', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_01_04_c = temp_answer.split("}}],")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-02-01-a', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_02_01_a = temp_answer.split("},")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-02-01-b', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_02_01_b = temp_answer.split("}},")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-02-01-c', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_02_01_c = temp_answer.split("}}],")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-02-02-a', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_02_02_a = temp_answer.split("},")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-02-02-b', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_02_02_b = temp_answer.split("}},")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-02-02-c', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_02_02_c = temp_answer.split("}}],")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-02-03-a', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_02_03_a = temp_answer.split("},")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-02-03-b', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_02_03_b = temp_answer.split("}},")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-02-03-c', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_02_03_c = temp_answer.split("}}],")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-02-04-a', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_02_04_a = temp_answer.split("},")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-02-04-b', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_02_04_b = temp_answer.split("}},")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-02-04-c', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_02_04_c = temp_answer.split("}}],")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-02-05-a', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_02_05_a = temp_answer.split("},")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-02-05-b', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_02_05_b = temp_answer.split("}},")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-02-05-c', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_02_05_c = temp_answer.split("}}],")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-02-06-a', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_02_06_a = temp_answer.split("},")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-02-06-b', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_02_06_b = temp_answer.split("}},")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-02-06-c', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_02_06_c = temp_answer.split("}}],")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-02-07-a', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_02_07_a = temp_answer.split("},")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-02-07-b', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_02_07_b = temp_answer.split("}},")[0].replace("'", "")

    temp_question = str(ordered[5]).split(
        "{'id': '2020-05-a-02-07-c', 'type':"
    )[1]
    temp_answer = temp_question.split("'answer': {'entry': ")[1]
    var_2020_05_a_02_07_c = temp_answer.split("}}],")[0].replace("'", "")

    var_2020_05_a_01_SUM_a = ""
    var_2020_05_a_01_SUM_b = ""
    var_2020_05_a_01_SUM_c = ""
    var_2020_05_a_02_SUM_a = ""
    var_2020_05_a_02_SUM_b = ""
    var_2020_05_a_02_SUM_c = ""
    var_2020_05_a_02_FORMULA_a = ""
    var_2020_05_a_02_FORMULA_b = ""
    var_2020_05_a_02_FORMULA_c = ""

    if (
        var_2020_05_a_01_01_a != "None"
        and var_2020_05_a_01_02_a != "None"
        and var_2020_05_a_01_03_a != "None"
        and var_2020_05_a_01_04_a != "None"
    ):
        var_2020_05_a_01_SUM_a = (
            int(var_2020_05_a_01_01_a)
            + int(var_2020_05_a_01_02_a)
            + int(var_2020_05_a_01_03_a)
            + int(var_2020_05_a_01_04_a)
        )
    if (
        var_2020_05_a_01_01_b != "None"
        and var_2020_05_a_01_02_b != "None"
        and var_2020_05_a_01_03_b != "None"
        and var_2020_05_a_01_04_b != "None"
    ):
        var_2020_05_a_01_SUM_b = (
            int(var_2020_05_a_01_01_b)
            + int(var_2020_05_a_01_02_b)
            + int(var_2020_05_a_01_03_b)
            + int(var_2020_05_a_01_04_b)
        )
    if (
        var_2020_05_a_01_01_c != "None"
        and var_2020_05_a_01_02_c != "None"
        and var_2020_05_a_01_03_c != "None"
        and var_2020_05_a_01_04_c != "None"
    ):
        var_2020_05_a_01_SUM_c = (
            int(var_2020_05_a_01_01_c)
            + int(var_2020_05_a_01_02_c)
            + int(var_2020_05_a_01_03_c)
            + int(var_2020_05_a_01_04_c)
        )

    if (
        var_2020_05_a_02_01_a != "None"
        and var_2020_05_a_02_02_a != "None"
        and var_2020_05_a_02_03_a != "None"
        and var_2020_05_a_02_04_a != "None"
        and var_2020_05_a_02_05_a != "None"
        and var_2020_05_a_02_06_a != "None"
        and var_2020_05_a_02_07_a != "None"
    ):
        var_2020_05_a_02_SUM_a = (
            int(var_2020_05_a_02_01_a)
            + int(var_2020_05_a_02_02_a)
            + int(var_2020_05_a_02_03_a)
            + int(var_2020_05_a_02_04_a)
            + int(var_2020_05_a_02_05_a)
            + int(var_2020_05_a_02_06_a)
            + int(var_2020_05_a_02_07_a)
        )
        var_2020_05_a_02_FORMULA_a = "%.2f" % (
            (
                (
                    int(var_2020_05_a_01_01_a)
                    + int(var_2020_05_a_01_02_a)
                    + int(var_2020_05_a_01_03_a)
                    - int(var_2020_05_a_01_04_a)
                )
                / 9
            )
        )
    if (
        var_2020_05_a_02_01_b != "None"
        and var_2020_05_a_02_02_b != "None"
        and var_2020_05_a_02_03_b != "None"
        and var_2020_05_a_02_04_b != "None"
        and var_2020_05_a_02_05_b != "None"
        and var_2020_05_a_02_06_b != "None"
        and var_2020_05_a_02_07_b != "None"
    ):
        var_2020_05_a_02_SUM_b = (
            int(var_2020_05_a_02_01_b)
            + int(var_2020_05_a_02_02_b)
            + int(var_2020_05_a_02_03_b)
            + int(var_2020_05_a_02_04_b)
            + int(var_2020_05_a_02_05_b)
            + int(var_2020_05_a_02_06_b)
            + int(var_2020_05_a_02_07_b)
        )
        var_2020_05_a_02_FORMULA_b = "%.2f" % (
            (
                (
                    int(var_2020_05_a_01_01_b)
                    + int(var_2020_05_a_01_02_b)
                    + int(var_2020_05_a_01_03_b)
                    - int(var_2020_05_a_01_04_b)
                )
                / 9
            )
        )
    if (
        var_2020_05_a_02_01_c != "None"
        and var_2020_05_a_02_02_c != "None"
        and var_2020_05_a_02_03_c != "None"
        and var_2020_05_a_02_04_c != "None"
        and var_2020_05_a_02_05_c != "None"
        and var_2020_05_a_02_06_c != "None"
        and var_2020_05_a_02_07_c != "None"
    ):
        var_2020_05_a_02_SUM_c = (
            int(var_2020_05_a_02_01_c)
            + int(var_2020_05_a_02_02_c)
            + int(var_2020_05_a_02_03_c)
            + int(var_2020_05_a_02_04_c)
            + int(var_2020_05_a_02_05_c)
            + int(var_2020_05_a_02_06_c)
            + int(var_2020_05_a_02_07_c)
        )
        var_2020_05_a_02_FORMULA_c = "%.2f" % (
            (
                (
                    int(var_2020_05_a_01_01_c)
                    + int(var_2020_05_a_01_02_c)
                    + int(var_2020_05_a_01_03_c)
                    - int(var_2020_05_a_01_04_c)
                )
                / 9
            )
        )

    context = {
        "sections": ordered,
        "state": state,
        "program_type": program_type,
        "l": len(ordered),
        "var_2020_03_c_02_01": var_2020_03_c_02_01,
        "var_2020_03_c_02_02": var_2020_03_c_02_02,
        "var_2020_03_c_02_03": var_2020_03_c_02_03,
        "var_2020_03_c_02_04": var_2020_03_c_02_04,
        "var_2020_03_c_03_02": var_2020_03_c_03_02,
        "var_2020_03_c_03_03": var_2020_03_c_03_03,
        "var_2020_03_c_03_04": var_2020_03_c_03_04,
        "var_2020_03_c_03_04_a": var_2020_03_c_03_04_a,
        "var_2020_03_c_03_04_b": var_2020_03_c_03_04_b,
        "var_2020_03_c_03_04_c": var_2020_03_c_03_04_c,
        "var_2020_03_c_04_02": var_2020_03_c_04_02,
        "var_2020_03_c_04_03": var_2020_03_c_04_03,
        "var_2020_03_c_04_04": var_2020_03_c_04_04,
        "var_2020_03_c_04_04_a": var_2020_03_c_04_04_a,
        "var_2020_03_c_04_04_b": var_2020_03_c_04_04_b,
        "var_2020_03_c_04_04_c": var_2020_03_c_04_04_c,
        "var_2020_03_e_02_08": var_2020_03_e_02_08,
        "var_2020_03_e_02_09": var_2020_03_e_02_09,
        "var_2020_03_e_02_10": var_2020_03_e_02_10,
        "var_2020_03_g_01_07_a": var_2020_03_g_01_07_a,
        "var_2020_03_g_01_07_b": var_2020_03_g_01_07_b,
        "var_2020_05_a_01_01_a": var_2020_05_a_01_01_a,
        "var_2020_05_a_01_01_b": var_2020_05_a_01_01_b,
        "var_2020_05_a_01_01_c": var_2020_05_a_01_01_c,
        "var_2020_05_a_01_02_a": var_2020_05_a_01_02_a,
        "var_2020_05_a_01_02_b": var_2020_05_a_01_02_b,
        "var_2020_05_a_01_02_c": var_2020_05_a_01_02_c,
        "var_2020_05_a_01_03_a": var_2020_05_a_01_03_a,
        "var_2020_05_a_01_03_b": var_2020_05_a_01_03_b,
        "var_2020_05_a_01_03_c": var_2020_05_a_01_03_c,
        "var_2020_05_a_01_04_a": var_2020_05_a_01_04_a,
        "var_2020_05_a_01_04_b": var_2020_05_a_01_04_b,
        "var_2020_05_a_01_04_c": var_2020_05_a_01_04_c,
        "var_2020_05_a_01_SUM_a": var_2020_05_a_01_SUM_a,
        "var_2020_05_a_01_SUM_b": var_2020_05_a_01_SUM_b,
        "var_2020_05_a_01_SUM_c": var_2020_05_a_01_SUM_c,
        "var_2020_05_a_02_01_a": var_2020_05_a_02_01_a,
        "var_2020_05_a_02_01_b": var_2020_05_a_02_01_b,
        "var_2020_05_a_02_01_c": var_2020_05_a_02_01_c,
        "var_2020_05_a_02_02_a": var_2020_05_a_02_02_a,
        "var_2020_05_a_02_02_b": var_2020_05_a_02_02_b,
        "var_2020_05_a_02_02_c": var_2020_05_a_02_02_c,
        "var_2020_05_a_02_03_a": var_2020_05_a_02_03_a,
        "var_2020_05_a_02_03_b": var_2020_05_a_02_03_b,
        "var_2020_05_a_02_03_c": var_2020_05_a_02_03_c,
        "var_2020_05_a_02_04_a": var_2020_05_a_02_04_a,
        "var_2020_05_a_02_04_b": var_2020_05_a_02_04_b,
        "var_2020_05_a_02_04_c": var_2020_05_a_02_04_c,
        "var_2020_05_a_02_05_a": var_2020_05_a_02_05_a,
        "var_2020_05_a_02_05_b": var_2020_05_a_02_05_b,
        "var_2020_05_a_02_05_c": var_2020_05_a_02_05_c,
        "var_2020_05_a_02_06_a": var_2020_05_a_02_06_a,
        "var_2020_05_a_02_06_b": var_2020_05_a_02_06_b,
        "var_2020_05_a_02_06_c": var_2020_05_a_02_06_c,
        "var_2020_05_a_02_07_a": var_2020_05_a_02_07_a,
        "var_2020_05_a_02_07_b": var_2020_05_a_02_07_b,
        "var_2020_05_a_02_07_c": var_2020_05_a_02_07_c,
        "var_2020_05_a_02_SUM_a": var_2020_05_a_02_SUM_a,
        "var_2020_05_a_02_SUM_b": var_2020_05_a_02_SUM_b,
        "var_2020_05_a_02_SUM_c": var_2020_05_a_02_SUM_c,
        "var_2020_05_a_02_FORMULA_a": var_2020_05_a_02_FORMULA_a,
        "var_2020_05_a_02_FORMULA_b": var_2020_05_a_02_FORMULA_b,
        "var_2020_05_a_02_FORMULA_c": var_2020_05_a_02_FORMULA_c,
    }

    html = template.render(context)

    # generate a pdf string (internal pdf string format)
    pdf = pdfkit.from_string(html, pdf_filename)

    # might need to set text type to utf8

    # encode a pdf string as base 64 to avoid decoding mismatches and collisions
    # encoded_pdf = base64.b64encode(pdf)

    # obtain list of files uploaded by user
    user_state = StatesFromUsername.objects.filter(
        username=request.user
    ).values_list("state_codes", flat=True)[0][0]

    uploaded_files = UploadedFiles.objects.filter(
        uploaded_username=request.user,
        uploaded_state=user_state,
    ).values("filename", "aws_filename")

    s3_bucket = os.environ.get("S3_UPLOADS_BUCKET_NAME")
    region = os.environ.get("AWS_REGION")
    session = boto3.session.Session()
    s3 = session.client("s3", f"{region}")

    uploaded_file_list = []

    for file in uploaded_files:
        uploaded_file_list.append(file)
    # uploadedFiles = {"uploaded_files": uploaded_file_list}

    for file in uploaded_file_list:
        with open(file["filename"], "wb") as f:
            s3.download_fileobj(s3_bucket, file["aws_filename"], f)

    # generate a zip file with newly generated pdf + some additional docs
    with ZipFile(zip_filename, "w") as zipObject:
        zipObject.write(pdf_filename)
        os.remove(pdf_filename)
        for file in uploaded_files:
            zipObject.write(file["filename"])
            os.remove(file["filename"])

    # open created zip file in binary format ...
    with open(
        "template" + today.strftime("%d_%m_%Y %H_%M_%S") + ".zip", "rb"
    ) as zipObject:
        # ... and base64 encode the results to prevent decoding mismatches and collisions
        encoded_zip = base64.b64encode(zipObject.read())

    response = HttpResponse(
        encoded_zip, content_type="application/octet-stream"
    )
    response["savefile"] = f"{zip_filename}"

    # return the content back as application/octet-stream as a 'catch-all' for all file types
    return response


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
