from functools import partial
from typing import List, Tuple, Union


PROGRAM_TYPES = (
    ("combo", "Combination"),
    ("medicaid_exp_chip", "Medicaid Expansion CHIP only"),
    ("separate_chip", "Separate CHIP only"),
)

US_STATES = (
    ("AK", "Alaska"),
    ("AL", "Alabama"),
    ("AR", "Arkansas"),
    ("AZ", "Arizona"),
    ("CA", "California"),
    ("CO", "Colorado"),
    ("CT", "Connecticut"),
    ("DC", "District of Columbia"),
    ("DE", "Delaware"),
    ("FL", "Florida"),
    ("GA", "Georgia"),
    ("HI", "Hawaii"),
    ("IA", "Iowa"),
    ("ID", "Idaho"),
    ("IL", "Illinois"),
    ("IN", "Indiana"),
    ("KS", "Kansas"),
    ("KY", "Kentucky"),
    ("LA", "Louisiana"),
    ("MA", "Massachusetts"),
    ("MD", "Maryland"),
    ("ME", "Maine"),
    ("MI", "Michigan"),
    ("MN", "Minnesota"),
    ("MO", "Missouri"),
    ("MS", "Mississippi"),
    ("MT", "Montana"),
    ("NC", "North Carolina"),
    ("ND", "North Dakota"),
    ("NE", "Nebraska"),
    ("NH", "New Hampshire"),
    ("NJ", "New Jersey"),
    ("NM", "New Mexico"),
    ("NV", "Nevada"),
    ("NY", "New York"),
    ("OH", "Ohio"),
    ("OK", "Oklahoma"),
    ("OR", "Oregon"),
    ("PA", "Pennsylvania"),
    ("RI", "Rhode Island"),
    ("SC", "South Carolina"),
    ("SD", "South Dakota"),
    ("TN", "Tennessee"),
    ("TX", "Texas"),
    ("UT", "Utah"),
    ("VA", "Virginia"),
    ("VT", "Vermont"),
    ("WA", "Washington"),
    ("WI", "Wisconsin"),
    ("WV", "West Virginia"),
    ("WY", "Wyoming"),
)

US_TERRITORIES = (
    ("AS", "American Samoa"),
    ("GU", "Guam"),
    ("MP", "Northern Mariana Islands"),
    ("PR", "Puerto Rico"),
    ("VI", "Virgin Islands"),
)

USER_ROLES = (  # Descending permissions order; alphabetical by coincidence
    ("admin_user", "Admin User"),
    ("bus_user", "Central Office Business Owner"),
    ("co_user", "Central Office User"),
    ("state_user", "State User"),
    ("temp_user", "Temporary User"),
)

# Once we have a more complete list of job codes, this should move to the db.
JOB_CODES_TO_ROLES = {
    "IDM_OKTA_TEST": ["state_user"],
    "CARTS_Group_Dev": ["admin_user", "bus_user", "co_user", "state_user"],
}

# Provisional; these need to be updated with the final list of statuses.
STATUSES = (
    ("not_started", "Not started"),
    ("started", "Started"),
    ("certified", "Certified"),
    ("uncertified", "Uncertified"),
    ("approved", "Approved"),
    ("submitted", "Submitted"),
    ("published", "Published"),
)


def parse_raw_ldap_job_codes(entry: str) -> List[dict]:
    """
    Job codes from Okta look something like this (without the linebreak)::

        cn=IDM_OKTA_TEST,ou=Groups,dc=cms,dc=hhs,dc=gov,
        cn=CARTS_Group_Dev,ou=Groups,dc=cms,dc=hhs,dc=gov

    We have confirmation from Okta on 2020-10-05 that this format is stable and
    that the opening ``,cn=`` can be relied upon as the marker of one entry
    ending and another beginning.

    cn, ou, and dc are from LDAP and refer to “Common Name”, “Organizational
    Unit”, and “Domain Component”. Given our purposes I'm renaming “Common
    Name” to “job_code” here, but re-using the LDAP terms for the others.

    We want to go from the above to::

        [
            {
                "job_code": "IDM_OKTA_TEST",
                "organizational_unit": "Groups",
                "domain_component": "cms.hhs.gov",
            },
            {
                "job_code": "CARTS_Group_Dev",
                "organizational_unit": "Groups",
                "domain_component": "cms.hhs.gov",
            },
        ]
    """

    def group_dc(val: list) -> list:
        # From [[dc, cms], [dc, hhs], [dc, gov]] to [dc, cms.hhs.gov]:
        dc = ".".join([_[1].lower() for _ in val if _[0] == "dc"])
        return [_ for _ in val if _[0] != "dc"] + [["dc", dc]]

    def shape(val: list) -> dict:
        with_ldap_keys = dict(group_dc(val))
        return {
            "job_code": with_ldap_keys["cn"],
            "organizational_unit": with_ldap_keys["ou"],
            "domain_component": with_ldap_keys["dc"],
        }

    delimited = entry.replace(",cn=", ";SPLIT;cn=")  # crude, but ¯\_(ツ)_/¯
    raw_entries = delimited.split(";SPLIT;")
    values = [[_.split("=") for _ in raw.split(",")] for raw in raw_entries]
    entries = [shape(value) for value in values]

    for parsed_entry in entries:
        for key in ("job_code", "organizational_unit", "domain_component"):
            assert key in parsed_entry
        assert parsed_entry.get("domain_component") == "cms.hhs.gov"
        assert parsed_entry.get("organizational_unit", "").lower() == "groups"

    return entries


def get_role_from_job_codes(
    roles: Tuple,  # Tuple of tuples containing role/friendly role pairs.
    role_code_map: dict,  # Base mapping of job codes to roles.
    db_role_map: list,  # DB's overriding mappings of job codes to roles.
    db_username_maps: list,  # DB's overriding mappings of this user to a role.
    entries: List[dict],  # List of job codes for this user from Okta.
) -> Union[bool, str]:
    codes = [entry["job_code"] for entry in entries]
    role_codes = [_[0] for _ in roles]
    # Update JOB_CODES_TO_ROLES with what's in the db via the db_role_map list:
    for role_mapping in db_role_map:
        job_code = role_mapping.job_code
        user_roles = role_mapping.user_roles
        valid_roles = [x for x in user_roles if x in role_codes]
        # Ensure only valid roles can be set here:
        if valid_roles:
            role_code_map[job_code] = valid_roles
    # The user must have some job code that maps to the role they've been
    # assigned as an individual user; the ability to map a specific user to a
    # role essentially just lets us prioritize so that if they're entitled to a
    # higher set of privileges we can still give them a lower privilege level.
    for username_map in db_username_maps:
        user_role = username_map.user_role
        if user_role in role_codes:
            for code in codes:
                if user_role in role_code_map.get(code, []):
                    return user_role
    # Go through the roles in order and check the job codes the user has to see
    # if they provide that role; this goes in order so that more-privileged
    # roles get set first.
    for role_code, _ in roles:
        for code in codes:
            if role_code in role_code_map.get(code, []):
                return role_code

    return False


def role_from_raw_ldap_job_codes_and_role_data(
    roles: Tuple,  # Tuple of tuples containing role/friendly role pairs.
    role_code_map: dict,  # Base mapping of job codes to roles.
    db_role_map: list,  # DB's overriding mapping of job codes to roles.
    db_username_map: list,  # DB's overriding mappings of this user to a role.
    entry: str,  # Raw string from Okta about user job codes.
) -> Union[bool, str]:
    codes = parse_raw_ldap_job_codes(entry)
    return get_role_from_job_codes(
        roles, role_code_map, db_role_map, db_username_map, codes
    )


role_from_raw_ldap_job_codes = partial(
    role_from_raw_ldap_job_codes_and_role_data, USER_ROLES, JOB_CODES_TO_ROLES
)
