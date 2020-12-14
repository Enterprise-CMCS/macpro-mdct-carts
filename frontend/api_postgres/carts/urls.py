"""carts URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin  # type: ignore
from django.urls import include, path  # type: ignore
from rest_framework import routers  # type: ignore
from carts.carts_api import views

section_list = views.SectionViewSet.as_view(
    {"get": "get_sections_by_year_and_state"}
)

section_single = views.SectionViewSet.as_view(
    {"get": "get_section_by_year_and_state"}
)

section_update = views.SectionViewSet.as_view({"put": "update_sections"})

router = routers.DefaultRouter()
router.register(r"users", views.UserViewSet)
router.register(r"groups", views.GroupViewSet)
router.register(r"sections", views.SectionViewSet)
router.register(r"sectionbases", views.SectionBaseViewSet)
router.register(r"sectionschemas", views.SectionSchemaViewSet)
router.register(r"state", views.StateViewSet)
router.register(r"role_assoc", views.RoleFromJobCodeViewSet)
router.register(r"roles_assoc", views.RolesFromJobCodeViewSet)
router.register(r"role_user_assoc", views.RoleFromUsernameViewSet)
router.register(r"state_assoc", views.StatesFromUsernameViewSet)
router.register(r"state_status", views.StateStatusViewSet)

api_patterns = [
    path("sections/<int:year>/<str:state>", section_list),
    path("sections/<int:year>/<str:state>/<int:section>", section_single),
    path("sections", section_update),
    path(
        "sections/<int:year>/<str:state>/<int:section>/<str:subsection>",
        views.section_subsection_by_year_and_state,
    ),
    path("questions/<str:state>/<slug:id>", views.fragment_by_year_state_id),
    path("generic-sections/<int:year>", views.sectionbases_by_year),
    path(
        "generic-sections/<int:year>/<int:section>",
        views.sectionbase_by_year_and_section,
    ),
    path(
        "generic-sections/<int:year>/<int:section>/<str:subsection>",
        views.sectionbase_by_year_section_subsection,
    ),
    path("generic-questions/<slug:id>", views.generic_fragment_by_id),
    path("appusers/auth", views.authenticate_user),
    path("initiate", views.initiate_session),
    path("psurl_upload", views.generate_upload_psurl),
    path("view_uploaded", views.view_uploaded_files),
    path("remove_uploaded", views.remove_uploaded_files),
    path("psurl_download", views.generate_download_psurl),
    path("appusers/<slug:username>", views.fake_user_data),
    path("userprofiles", views.UserProfilesViewSet),
    path("user/activate/<str:user>", views.UserActivateViewSet),
    path("user/deactivate/<str:user>", views.UserDeactivateViewSet),
    path("adduser/<str:eua_id>/<str:state_code>/<str:role>", views.AddUser),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include(router.urls)),
    path("report/<int:year>/<str:state>/", views.report),
    path(
        "data/<int:year>/<str:state>/<int:section>",
        views.section_by_year_and_state,
    ),
    path(
        "structure/<int:year>/<int:section>",
        views.sectionbase_by_year_and_section,
    ),
    # path('api-auth/', include('rest_framework.urls',
    #  namespace='rest_framework'))
    path("api/v1/", include(api_patterns)),
]
