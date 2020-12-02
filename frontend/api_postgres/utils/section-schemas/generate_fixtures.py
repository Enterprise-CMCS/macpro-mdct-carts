from pathlib import Path
from typing import (
    List,
    Tuple,
    Union,
    cast,
)
import json
import csv
import shutil  # type: ignore
import jsonschema  # type: ignore

Json = Union[dict, list]


def main() -> None:
    here, there, states = file_setup()

    write_state_section_json(here, states)
    write_fixtures(here, there, states)
    write_states(here, there)
    load_acs_data(here, there)
    load_fmap_data(here, there)


def write_state_section_json(here: Path, states: Path) -> None:
    state_list = load_csv(here / "state-fixture-data.csv")
    state_data = {_["State abbreviation"]: _ for _ in state_list}
    state_codes = cast(dict, load_json(here / "state_to_abbrev.json"))
    state_abbrevs = {v: k for k, v in state_codes.items()}

    generic_files = sorted(here.glob("backend-json-section-*.json"))
    generic_sections = [cast(dict, load_json(f)) for f in generic_files]

    for k in list(state_abbrevs.keys()):
        try:
            first = populate_section_zero(state_data[k], generic_sections[0])
            write_json(states / f"2020-{k.lower()}-section-0.json", first)
            rest = [
                populate_section(state_data[k], s)
                for s in generic_sections[1:]
            ]
            for i, section in enumerate(rest):
                num = i + 1
                assert section["section"]["ordinal"] == num
                write_json(
                    states / f"2020-{k.lower()}-section-{num}.json", section
                )
        except KeyError:
            print(f"Could not find state data for {k} - skipping")


def populate_section_zero(state_info: dict, section: dict) -> dict:
    section["section"]["state"] = state_info["State abbreviation"]
    updates = (
        ("2020-00-a-01-01", "State"),
        ("2020-00-a-01-02", "Type"),
        ("2020-00-a-01-03", "Program Names"),
    )
    questions = section["section"]["subsections"][0]["parts"][0]["questions"]
    new_qs: List[dict] = []
    for q in questions:
        for q_id, key in updates:
            if q.get("id") == q_id:
                answer = {**q["answer"], **{"entry": state_info[key]}}
                q = {**q, **{"answer": answer}}
        new_qs.append(q)

    contact = (
        ("2020-00-a-01-04", "Contact"),
        ("2020-00-a-01-05", "Title"),
        ("2020-00-a-01-06", "Email"),
        ("2020-00-a-01-07", "Address"),
        ("2020-00-a-01-08", "Phone"),
    )
    contact_element = cast(dict, new_qs[-1])
    contact_qs = contact_element["questions"]
    new_contact_qs = []
    for q in contact_qs:  # fragile but not that hard to change
        for q_id, key in contact:
            if q.get("id") == q_id:
                answer = {**q["answer"], **{"entry": state_info[key]}}
                q = {**q, **{"answer": answer}}
        new_contact_qs.append(q)
    new_contact_fieldset: dict = {
        **contact_element,
        **{"questions": new_contact_qs},
    }
    updated = new_qs[:3] + [new_contact_fieldset]

    section["section"]["subsections"][0]["parts"][0]["questions"] = updated
    return section


def populate_section(state_info: dict, section: dict) -> dict:
    section["section"]["state"] = state_info["State abbreviation"]
    return section


def write_fixtures(here: Path, there: Path, states: Path) -> None:
    def etl(fpath: Path, modelname: str, schema: Json) -> None:
        orig = load_json(fpath)
        jsonschema.validate(schema=schema, instance=orig)
        output = transform(modelname, orig)
        write_json(there / f.name, output)

    schema = load_json(here / "backend-section.schema.json")
    schemafixture = transform("carts_api.sectionschema", schema)
    schemapath = there / "backend-section.schema.json"
    write_json(schemapath, schemafixture)

    for f in here.glob("backend-json-section-*.json"):
        etl(f, "carts_api.sectionbase", schema)

    for f in states.glob("2020-*.json"):
        etl(f, "carts_api.section", schema)


def file_setup() -> Tuple[Path, Path, Path]:
    here = Path(__file__).parent.resolve()
    django_root = here.parent.parent.resolve()
    there = (django_root / "fixtures").resolve()
    states = (here / "state-files").resolve()

    # In production these directories persist; we don't want fixtures from
    # prior runs to remain, as they may cause problems in future (and already
    # may be confusing the compare_fixtures.py script).
    if there.exists() and there.is_dir():
        shutil.rmtree(there)
    if states.exists() and states.is_dir():
        shutil.rmtree(states)

    # Break early if anything has moved unexpectedly:
    assert here.name == "section-schemas"
    assert here == django_root / "utils" / "section-schemas"

    there.mkdir()
    states.mkdir()
    return here, there, states


def transform(model, orig):
    models = {
        "carts_api.sectionschema": {
            "model": "carts_api.sectionschema",
            "fields": {"year": 2020},
        },
        "carts_api.sectionbase": {
            "model": "carts_api.sectionbase",
            "fields": {},
        },
        "carts_api.section": {"model": "carts_api.section", "fields": {}},
    }
    entry = models[model]
    entry["fields"]["contents"] = orig
    return [entry]


def write_states(here, there):
    def to_object(state_dict: dict) -> dict:
        names = [_.strip() for _ in state_dict["Program Names"].split(",")]
        return {
            "model": "carts_api.State",
            "fields": {
                "code": state_dict["State abbreviation"],
                "name": state_dict["State"],
                "program_type": state_dict["Type"],
                "program_names": names,
            },
        }

    state_list = load_csv(here / "state-fixture-data.csv")
    states = [to_object(state) for state in state_list]
    write_json(there / "states.json", states)


def load_acs_data(here, there):
    state_to_abbrev = json.loads(
        Path(here, "state_to_abbrev.json").read_text()
    )

    # census is inconsistent with case in state names so make uniform names
    states_upper = {}
    for k, v in state_to_abbrev.items():
        states_upper[k.upper()] = v

    years = ["2015", "2016", "2017", "2018", "2019"]
    acs_data = []
    for y in years:
        csvf = open(Path(here, "hi10-acs-%s.csv" % y), "r")
        reader = csv.reader(csvf, delimiter=",")
        next(reader)  # skip header
        next(reader)  # skip US totals
        # ACS data uses 'Z' to mean 0 or rounds to 0
        for row in reader:
            obj = {
                "model": "carts_api.ACS",
                "fields": {
                    "year": y,
                    "state": states_upper[row[0].upper()],
                    "number_uninsured": 0
                    if row[1].lower() == "z"
                    else int(row[1]) * 1000,  # numbers measured in thousands
                    "number_uninsured_moe": 0
                    if row[2].lower() == "z"
                    else int(row[2]) * 1000,
                    "percent_uninsured": row[3],
                    "percent_uninsured_moe": row[4],
                },
            }
            acs_data.append(obj)
    outputpath = Path(there, "acs.json")
    outputpath.write_text(json.dumps(acs_data))


def load_fmap_data(here, there):
    csvf = open(Path(here, "2020-fmap-data.csv"), "r")
    reader = csv.DictReader(csvf, delimiter=",")
    fmaps = []
    for row in reader:
        obj = {
            "model": "carts_api.FMAP",
            "fields": {
                "fiscal_year": 2020,
                "state": row["State abbreviation"],
                "enhanced_FMAP": row["enhanced FMAP"],
            },
        }
        fmaps.append(obj)
    outputpath = Path(there, "2020-fmap.json")
    outputpath.write_text(json.dumps(fmaps))


def load_json(path: Path) -> Json:
    return json.loads(path.read_text())


def load_csv(path: Path) -> list:
    return [*csv.DictReader(path.open())]


def write_json(path: Path, contents: Json) -> None:
    path.write_text(json.dumps(contents))


if __name__ == "__main__":
    main()
