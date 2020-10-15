from types import SimpleNamespace
import pytest
from carts.carts_api.model_utils import (
    USER_ROLES,
    JOB_CODES_TO_ROLES,
    get_role_from_job_codes,
)


@pytest.mark.parametrize(
    "roles,role_code_map,db_role_map,db_username_map,entries,expected",
    (
        (USER_ROLES, JOB_CODES_TO_ROLES, [], [], [], False),
        (  # with the defaults and CARTS_Group_Dev, we get back admin_user:
            USER_ROLES,
            JOB_CODES_TO_ROLES,
            [],
            [],
            [{"job_code": "CARTS_Group_Dev"}],
            "admin_user",
        ),
        (  # with no defaults we get False:
            USER_ROLES,
            {},
            [],
            [],
            [{"job_code": "CARTS_Group_Dev"}],
            False,
        ),
        (  # with the association set in the db, we get back admin_user:
            USER_ROLES,
            {},
            [
                SimpleNamespace(
                    **{
                        "job_code": "CARTS_Group_Dev",
                        "user_roles": ["admin_user"],
                    }
                ),
            ],
            [],
            [{"job_code": "CARTS_Group_Dev"}],
            "admin_user",
        ),
        (  # with the association set in the defaults and the user set
            # specifically to state_user, we get back state_user:
            USER_ROLES,
            {
                "IDM_OKTA_TEST": ["state_user"],
                "CARTS_Group_Dev": ["admin_user"],
            },
            [
                SimpleNamespace(
                    job_code="CARTS_Group_Dev",
                    user_roles=["admin_user"],
                ),
            ],
            [
                SimpleNamespace(
                    user_role="state_user",
                ),
            ],
            [{"job_code": "CARTS_Group_Dev"}, {"job_code": "IDM_OKTA_TEST"}],
            "state_user",
        ),
        (  # with the association set in the db and the user set specifically
            # to state_user, we get back state_user:
            USER_ROLES,
            {},
            [
                SimpleNamespace(
                    job_code="CARTS_Group_Dev",
                    user_roles=["admin_user"],
                ),
                SimpleNamespace(
                    job_code="IDM_OKTA_TEST",
                    user_roles=["state_user"],
                ),
            ],
            [
                SimpleNamespace(
                    user_role="state_user",
                ),
            ],
            [{"job_code": "CARTS_Group_Dev"}, {"job_code": "IDM_OKTA_TEST"}],
            "state_user",
        ),
        (  # with the association set in the db and the user set
            # specifically to admin_user—a role their job codes don't allow
            # for—we get back state_user:
            USER_ROLES,
            {},
            [
                SimpleNamespace(
                    job_code="IDM_OKTA_TEST",
                    user_roles=["state_user"],
                ),
            ],
            [
                SimpleNamespace(
                    user_role="admin_user",
                ),
            ],
            [{"job_code": "IDM_OKTA_TEST"}],
            "state_user",
        ),
        (  # with the association set in the db and the user set
            # specifically to admin_user—a role their job codes don't allow
            # for—we get back state_user, even if they have CARTS_Group_Dev:
            USER_ROLES,
            {},
            [
                SimpleNamespace(
                    job_code="IDM_OKTA_TEST",
                    user_roles=["state_user"],
                ),
            ],
            [
                SimpleNamespace(
                    user_role="admin_user",
                ),
            ],
            [{"job_code": "CARTS_Group_Dev"}, {"job_code": "IDM_OKTA_TEST"}],
            "state_user",
        ),
        (  # with an association set in the db that doesn't match any role, we
            # get back False:
            USER_ROLES,
            {},
            [
                SimpleNamespace(
                    job_code="IDM_OKTA_TEST",
                    user_roles=["unknown_user"],
                ),
            ],
            [],
            [{"job_code": "CARTS_Group_Dev"}, {"job_code": "IDM_OKTA_TEST"}],
            False,
        ),
        (  # with an association set twice in the db that doesn't match any
            # role, we get back False:
            USER_ROLES,
            {},
            [
                SimpleNamespace(
                    job_code="IDM_OKTA_TEST",
                    user_roles=["unknown_user"],
                ),
            ],
            [
                SimpleNamespace(
                    user_role="unknown_user",
                ),
            ],
            [{"job_code": "CARTS_Group_Dev"}, {"job_code": "IDM_OKTA_TEST"}],
            False,
        ),
        (  # with the association set in the defaults and the user set
            # specifically to state_user, we get back state_user, checking
            # against multiple roles associated with a job code.
            USER_ROLES,
            {
                "IDM_OKTA_TEST": ["state_user"],
                "CARTS_Group_Dev": ["admin_user", "state_user"],
            },
            [
                SimpleNamespace(
                    job_code="CARTS_Group_Dev",
                    user_roles=["admin_user", "state_user"],
                ),
            ],
            [
                SimpleNamespace(
                    user_role="state_user",
                ),
            ],
            [{"job_code": "CARTS_Group_Dev"}],
            "state_user",
        ),
        (  # with the association set in the defaults and the user set
            # specifically to state_user, but then the db overrides that to
            # just allow admin_user, we get back admin_user, checking
            # against multiple roles associated with a job code.
            USER_ROLES,
            {
                "IDM_OKTA_TEST": ["state_user"],
                "CARTS_Group_Dev": ["admin_user", "state_user"],
            },
            [
                SimpleNamespace(
                    job_code="CARTS_Group_Dev",
                    user_roles=["admin_user"],
                ),
            ],
            [
                SimpleNamespace(
                    user_role="state_user",
                ),
            ],
            [{"job_code": "CARTS_Group_Dev"}],
            "admin_user",
        ),
    ),
    ids=repr,
)
def test_get_role_from_job_codes(
    roles, role_code_map, db_role_map, db_username_map, entries, expected
):
    result = get_role_from_job_codes(
        roles, role_code_map, db_role_map, db_username_map, entries
    )
    assert result == expected
