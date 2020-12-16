import json
import string
from typing import (
    Dict,
    List,
    Union,
)
import boto3
from botocore.config import Config
import os
import random

from datetime import datetime
from django.contrib.auth.models import User, Group  # type: ignore
from django.db import transaction  # type: ignore
from django.http import HttpResponse  # type: ignore
from django.template.loader import get_template  # type: ignore
from django.utils import timezone  # type: ignore
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
        elif user.appuser.role in ("bus_user", "co_user"):
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
            result.status_code = 409

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
