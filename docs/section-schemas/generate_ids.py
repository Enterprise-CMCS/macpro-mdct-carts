import argparse
import json
import jsonschema  # type: ignore
import pdb
import string
import sys
from jsonpath_ng.ext import parse
from pathlib import Path
from typing import (
    Dict,
    List,
    Union,
)

sample = {
    "section": {
        "year": 2020,
        "ordinal": 1,
        "id": None,
        "subsections": [
            {
                "type": "subsection",
                "id": None,
                "parts": [
                    {
                        "type": "part",
                        "id": "2020-01-a-01",
                        "questions": [
                            {
                                "type": "text_long",
                                "id": "2020-01-a-01-01",
                                "questions": [
                                    {
                                        "type": "text_long",
                                        "id": "2020-01-a-01-01-a",
                                    }
                                ]
                            },
                            {
                                "type": "fieldset",
                                "questions": [
                                    {
                                        "type": "text_long",
                                        "id": "2020-01-a-01-02",
                                    },
                                    {
                                        "type": "text_long",
                                        "id": "2020-01-a-01-03",
                                    }
                                ]
                            },
                            {
                                "type": "text_long",
                                "id": "2020-01-a-01-04",
                                "questions": [
                                    {
                                        "type": "text_long",
                                        "id": "2020-01-a-01-04-a",
                                    }
                                ]
                            },
                        ]
                    }
                ]
            }
        ]
    }
}
DictOrList = Union[Dict, List]

# lettermarkers1 = [_ for _ in string.ascii_lowercase]
# lettermarkers = [_ for _ in string.ascii_lowercase] +\
#                 [f'{_ * 2}' for _ in string.ascii_lowercase]
lettermarkers = [_ for _ in string.ascii_lowercase] +\
                [f'{a}{b}' for a in string.ascii_lowercase for b in
                 string.ascii_lowercase]
numbermarkers = [str(_).zfill(2) for _ in range(0, 100)]
question_types = (
    "checkbox",
    "daterange",
    "email",
    "file_upload",
    "integer",
    "mailing_address",
    "money",
    "percentage",
    "phone_number",
    "radio",
    "ranges",
    "text_long",
    "text_short",
)


def is_lettermarker(val: str) -> bool:
    return val in lettermarkers


def is_numbermarker(val: str) -> bool:
    return val in numbermarkers


def is_year(val: Union[str, int]) -> bool:
    return int(val) < 3000 and int(val) > 1900


def is_section(val: Union[str, int]) -> bool:
    return int(val) < 100 and int(val) > -1


def is_subquestion(parent_type: str, this_type: str) -> bool:
    non_questions = ["fieldset"] + list(numbered) + list(lettered)
    return parent_type not in non_questions and this_type not in non_questions


markers = {
    "year": is_year,
    "section": is_numbermarker,
    "subsection": is_lettermarker,
    "part": is_numbermarker,
    "objective": is_numbermarker,
    "repeatable": is_numbermarker,
    "question": is_numbermarker,
    "l1_child_question": is_lettermarker,
}
numbered = (
    "section",
    "part",
    "objective",
    "repeatable",
    "question",
)
lettered = (
    "subsection",
    "l1_child_question",
)


def increment_letter(val: str) -> str:
    return lettermarkers[lettermarkers.index(val) + 1]


def increment_number(val: Union[str, int]) -> str:
    canonical = str(val).zfill(2)
    return numbermarkers[numbermarkers.index(canonical) + 1]


def increment(val: Union[str, int]) -> str:
    if val in numbermarkers:
        return increment_number(val)
    elif val in lettermarkers:
        return increment_letter(val)
    else:
        assert False


def idx_to_numbermarker(val: int) -> str:
    return numbermarkers[val]


def idx_to_lettermarker(val: int) -> str:
    return lettermarkers[val]


def main(args: List[str] = None) -> None:
    options = setup_cli_parser().parse_args()
    if options.content:
        data = json.loads(Path(options.content).read_text())
    else:
        data = json.loads(sys.stdin.read().strip())

    with_ids = parse("$..*[?(@.id)].id")
    # with_ids2 = parse("$.*[?(@.id==null)].id")
    res = with_ids.find(data)
    # paths = with_ids.paths(data)
    root_id = data["section"]["id"]
    # we know all children of sections should be letters, so subsections should
    # all be root id plus two in length
    target_length = len(root_id) + 2
    subsections = [x for x in res if len(x.value) == target_length]
    for i, _ in enumerate(subsections):
        ideal = "-".join([root_id, lettermarkers[i]])
        if not _.value == ideal:
            import pdb; pdb.set_trace()

        assert _.value == ideal
        assert _.context.value["id"] == ideal
        part_id_expr = parse("parts[?(@.type=='part')].id")
        parts = part_id_expr.find(_.context.value)
        for i, part in enumerate(parts):
            part_ideal = "-".join([ideal, numbermarkers[i + 1]])
            assert part.value == part_ideal
            qs_expr = parse("questions[*]")
            qs = qs_expr.find(part.context.value)
            # Questions are recursive, so this is where things get tricky.
            handle_questions(part_ideal, qs)

    import pdb; pdb.set_trace()

    # with_ids = generate_ids(data)
    # with_ids = generate_ids(sample)


def handle_questions(parent_id: str, qs: List) -> None:
    fieldset_count = 0
    for i, question in enumerate(qs):
        if question.value["type"] == "fieldset":
            fieldset_count = fieldset_count + 1
            fqs_expr = parse("questions[*]")
            fqs = fqs_expr.find(question.value)
            handle_questions(parent_id, fqs)
        continue

        iternum = i + 1 - fieldset_count
        q_ideal = "-".join([parent_id, numbermarkers[iternum]])
        if question.value.get("id", "") != q_ideal:
            import pdb; pdb.set_trace()

        assert question.value.get("id", "") == q_ideal



def generate_ids(data: DictOrList) -> DictOrList:
    # Start with section.
    section = data["section"]
    assert markers["year"](section["year"])
    sectionmarker = str(section["ordinal"]).zfill(2)
    assert markers["section"](sectionmarker)
    identifier = [str(section["year"]), sectionmarker]
    section["id"] = "-".join(identifier)
    subsections = section["subsections"]
    for i, subsection in enumerate(subsections):
        subsection = add_id_to_lettermarker(subsection, i, identifier[:])


def add_id_to_numbermarker(item: Dict, idx: int, identifier: List[str]):
    assert item["type"] in numbered
    fragment = idx_to_numbermarker(idx)
    new_id = identifier + [fragment]
    assert item["id"] == "-".join(new_id)
    for child in enumerate(item["questions"]):
        if is_subquestion(item.get("type"), child.get("type")):
            child = add_id_to_


def add_id_to_lettermarker(item: Dict, idx: int, identifier: List[str]):
    assert item["type"] in lettered
    fragment = idx_to_lettermarker(idx)
    new_id = identifier + [fragment]
    assert item["id"] == "-".join(new_id)
    children = "parts" if "parts" in item else "questions"
    walk(item[children], new_id, 3, False)

    """
    for i, child in enumerate(item[children]):
        if child.get("type") == "fieldset":
            child = pass_through(child, i + 1, new_id[:]
        else:
            child = add_id_to_numbermarker(child, i + 1, new_id[:])
    """

def walk(items, new_id, level, parent_is_question):
    print("walking", new_id, level, parent_is_question)
    for item in items:
        # if the item is of a type that gets an id, give it a new id, update
        # new_id, and walk its children while incrementing the level.
        # Otherwise, walk its children without incrementing the level.
        if level + 1 == len(new_id):
            new_id[-1] = increment(new_id[-1])
        elif level + 1 > len(new_id):
            if parent_is_question and item.get("type") in question_types:
                new_id.append(lettermarkers[0])
            else:
                new_id.append(numbermarkers[1])
            if "id" in item:
                if not "-".join(new_id) == item.get("id"):
                    pdb.set_trace()
                assert "-".join(new_id) == item.get("id")
                print("-".join(new_id))
        if item.get("questions"):
            if item.get("type") in question_types:
                new_id, level = walk(item["questions"], new_id,
                                     level + 1, True)
            elif item.get("type") in ("objective", "objectives", "repeatable",
                                      "repeatables", "part"):
                new_id, level = walk(item["questions"], new_id,
                                     level + 1, False)
            elif item.get("type") == "fieldset":
                new_id, level = walk(item["questions"], new_id, level + 1,
                                     parent_is_question)
            else:
                pdb.set_trace()
        else:
            print(new_id, level -1)
            return new_id, level - 1
    return new_id, level - 1









def setup_cli_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-i",
        "--input",
        default=None,
        dest="content",
        help="Input file to read JSON from."
    )
    parser.add_argument(
        "-c",
        "--check-ids",
        action="store_true",
        help="Instead of generating, check current ids for validity."
    )

    return parser


if __name__ == '__main__':
    main()
