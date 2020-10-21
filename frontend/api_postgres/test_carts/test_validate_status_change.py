import pytest
from carts.carts_api.model_utils import (
    StatusUpdateMessage,
    validate_status_change,
)


@pytest.mark.parametrize(
    "user_role,current_status,new_status,expected",
    (
        (
            "state_user",
            "not_started",
            "in_progress",
            StatusUpdateMessage(
                new_status="in_progress",
                update_success=True,
                message="state_user set not_started to in_progress",
            ),
        ),
        (
            "state_user",
            "certified",
            "uncertified",
            StatusUpdateMessage(
                new_status="certified",
                update_success=False,
                message="state_user can't set certified to uncertified",
            ),
        ),
        (
            "co_user",
            "certified",
            "uncertified",
            StatusUpdateMessage(
                new_status="uncertified",
                update_success=True,
                message="co_user set certified to uncertified",
            ),
        ),
        (
            "bus_user",
            "certified",
            "uncertified",
            StatusUpdateMessage(
                new_status="uncertified",
                update_success=True,
                message="bus_user set certified to uncertified",
            ),
        ),
        (
            "co_user",
            "certified",
            "approved",
            StatusUpdateMessage(
                new_status="approved",
                update_success=True,
                message="co_user set certified to approved",
            ),
        ),
        (
            "bus_user",
            "certified",
            "approved",
            StatusUpdateMessage(
                new_status="approved",
                update_success=True,
                message="bus_user set certified to approved",
            ),
        ),
        (
            "admin_user",
            "certified",
            "approved",
            StatusUpdateMessage(
                new_status="certified",
                update_success=False,
                message="admin_user can't set certified to approved",
            ),
        ),
        (
            "admin_user",
            "whatever",
            "approved",
            StatusUpdateMessage(
                new_status="whatever",
                update_success=False,
                message="Current status of whatever is invalid",
            ),
        ),
        (
            "admin_user",
            "in_progress",
            "whatever",
            StatusUpdateMessage(
                new_status="in_progress",
                update_success=False,
                message="New status of whatever is invalid",
            ),
        ),
        (
            "state_user",
            "in_progress",
            "not_started",
            StatusUpdateMessage(
                new_status="in_progress",
                update_success=False,
                message="Can't move to not_started from in_progress",
            ),
        ),
    ),
    ids=repr,
)
def test_validate_status_change(
    user_role, current_status, new_status, expected
):
    result = validate_status_change(user_role, current_status, new_status)
    assert result == expected
