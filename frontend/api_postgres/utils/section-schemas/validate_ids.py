import argparse
import json
import jsonschema  # type: ignore
import pdb
import string
import sys
from jsonpath_ng.ext import parse  # type: ignore
from jsonpath_ng import DatumInContext  # type: ignore
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
        "id": "2020-01",
        "subsections": [
            {
                "type": "subsection",
                "id": "2020-01-a",
                "parts": [
                    {
                        "type": "part",
                        "id": "2020-01-a-01",
                        "questions": [
                            {
                                "type": "text_multiline",
                                "id": "2020-01-a-01-01",
                                "questions": [
                                    {
                                        "type": "text_multiline",
                                        "id": "2020-01-a-01-01-a",
                                    }
                                ],
                            },
                            {
                                "type": "fieldset",
                                "questions": [
                                    {
                                        "type": "text_multiline",
                                        "id": "2020-01-a-01-02",
                                    },
                                    {
                                        "type": "text_multiline",
                                        "id": "2020-01-a-01-03",
                                    },
                                ],
                            },
                            {
                                "type": "text_multiline",
                                "id": "2020-01-a-01-04",
                                "questions": [
                                    {
                                        "type": "text_long",
                                        "id": "2020-01-a-01-04-a",
                                    }
                                ],
                            },
                        ],
                    }
                ],
            }
        ],
    }
}

lettermarkers = [_ for _ in string.ascii_lowercase] + [
    f"{_ * 2}" for _ in string.ascii_lowercase
]
"""
lettermarkers = [_ for _ in string.ascii_lowercase] +\
                [f'{a}{b}' for a in string.ascii_lowercase for b in
                 string.ascii_lowercase]
"""
numbermarkers = [str(_).zfill(2) for _ in range(0, 100)]


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

    schema = json.loads(Path(".", "backend-section.schema.json").read_text())

    # data = sample
    jsonschema.validate(instance=data, schema=schema)
    with_ids = parse("$..*[?(@.id)].id")
    res = with_ids.find(data)
    # paths = with_ids.paths(data)
    root_id = data["section"]["id"]
    # we know all children of sections should be letters, so subsections should
    # all be root id plus two in length. This approach is basically cheating
    # and should change as soon as we're trying to generate rather than
    # validate ids.
    target_length = len(root_id) + 2
    subsections = [x for x in res if len(x.value) == target_length]
    graph_markers = {}
    for i, _ in enumerate(subsections):
        ideal = "-".join([root_id, lettermarkers[i]])
        if not _.value == ideal:
            raise Exception

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
            markers_for_part = dfs_questions(part_ideal, qs, {})
            graph_markers[part_ideal] = markers_for_part[part_ideal]
    print("miraculously, no problems encountered")
    print(json.dumps(graph_markers))


def dfs_questions(
    parent_id: str,
    qs: List,
    graph_markers: Dict,
    parent_is_question: bool = False,
):
    if parent_id in graph_markers:
        print("Why is the key here already?")
    else:
        print(parent_id)
        graph_markers[parent_id] = {}
    for question in qs:
        qresult = dfs_question(
            parent_id,
            question,
            graph_markers,
            parent_is_question=parent_is_question,
        )
        graph_markers[parent_id] = {**graph_markers[parent_id], **qresult}
    return graph_markers


def dfs_question(
    parent_id: str,
    question: DatumInContext,
    graph_markers: Dict,
    parent_is_question: bool = False,
) -> Dict:
    # What kind of question am I?
    marking = is_marking(question)
    qtypes = [
        "checkbox",
        "checkbox_flag",
        "daterange",
        "email",
        "file_upload",
        "integer",
        "mailing_address",
        "money",
        "objectives",
        "percentage",
        "phone_number",
        "radio",
        "ranges",
        "text",
        "text_medium",
        "text_multiline",
        "text_small",
    ]

    if question.value["type"] in (
        "objective",
        "objectives",
        "repeatable",
        "repeatables",
    ):
        sending_parent_is_question = False
    elif question.value["type"] == "fieldset":
        if is_marking(question):
            sending_parent_is_question = True
        else:
            sending_parent_is_question = parent_is_question
    elif question.value["type"] in qtypes:
        sending_parent_is_question = True
    else:
        sending_parent_is_question = parent_is_question

    if marking:
        # We know we're marking and we know who the parent is. So if the
        # parent_id has no keys, we're the first.
        if not graph_markers.get(parent_id):
            print("making first descendant")
            if check_for_unmarked(question):
                this_marker = make_first_descendant(parent_id, False, True)
            else:
                this_marker = make_first_descendant(
                    parent_id, parent_is_question
                )
            print("received descendant", this_marker)
            graph_markers[parent_id][this_marker] = {}
        else:
            print("making sibling")
            this_marker = make_next_sibling(
                parent_id, graph_markers[parent_id]
            )
            print("received sibling", this_marker)
            graph_markers[parent_id][this_marker] = {}

        if question.value.get("id"):
            if question.value.get("id") != this_marker:
                print(question.value["id"], this_marker)
                raise Exception

        subqs_expr = parse("questions[*]")
        subqs = subqs_expr.find(question.value)
        if not subqs:
            print("no subquestions, returning", graph_markers.keys())
            return graph_markers[parent_id]

        graph_markers[parent_id][this_marker] = dfs_questions(
            this_marker,
            subqs,
            {},
            parent_is_question=sending_parent_is_question,
        )
        return graph_markers[parent_id]
    else:
        this_marker = parent_id
        subqs_expr = parse("questions[*]")
        subqs = subqs_expr.find(question.value)
        if not subqs:
            return graph_markers[parent_id]

        return dfs_questions(
            this_marker,
            subqs,
            graph_markers,
            parent_is_question=sending_parent_is_question,
        )[parent_id]


def is_marking(question_jsonpath: DatumInContext) -> bool:
    question = question_jsonpath.value

    if question["type"] == "fieldset":
        if question.get("fieldset_type", "") == "marked":
            return True
        else:
            return False
    else:
        return True


def make_first_descendant(
    parent_id: str,
    parent_is_question: bool = False,
    unmarked_descendants: bool = False,
) -> str:
    if not parent_is_question:
        if unmarked_descendants:
            return f"{parent_id}-unmarked_descendants"
        else:
            return "-".join([parent_id, numbermarkers[1]])
    else:
        count = len([_ for _ in parent_id.split("-") if _ in lettermarkers])
        if count < 2:
            return "-".join([parent_id, lettermarkers[0]])
        else:
            return "-".join([parent_id, numbermarkers[1]])


def make_next_sibling(parent_id: str, graph_markers: Dict) -> str:
    print("parent_id in make_next_sibling", parent_id)
    print(graph_markers.keys())
    last_sibling = [*graph_markers.keys()][-1]
    deconstructed = last_sibling.split("-")
    last_chunk = deconstructed[-1]
    if last_chunk == "unmarked_descendants":
        deconstructed = last_sibling.split("-")[:-1]
        last_chunk = deconstructed[-1]
        return make_first_descendant("-".join(deconstructed), True)
    replacement_chunk = ""
    if is_lettermarker(last_chunk):
        replacement_chunk = increment_letter(last_chunk)
    elif is_numbermarker(last_chunk):
        replacement_chunk = increment_number(last_chunk)
    else:
        raise
    new_sibling = "-".join(deconstructed[:-1] + [replacement_chunk])
    print("making sibling", last_sibling, new_sibling)
    return new_sibling


def check_for_unmarked(question: DatumInContext) -> bool:
    try:
        val = question.context.context.value
        if val.get("fieldset_type", "") == "unmarked_descendants":
            print("unmarked descendants")
            return True
    except Exception:
        return False
    return False


def setup_cli_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-i",
        "--input",
        default=None,
        dest="content",
        help="Input file to read JSON from.",
    )
    parser.add_argument(
        "-c",
        "--check-ids",
        action="store_true",
        help="Instead of generating, check current ids for validity.",
    )

    return parser


if __name__ == "__main__":
    main()
