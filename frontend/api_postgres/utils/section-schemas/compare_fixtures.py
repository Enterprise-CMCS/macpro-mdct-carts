"""
The contents of the JSON in the docs/section-schemas files should match the
contents of the fields.contents property in the fixture files.
"""
import json
from pathlib import Path
from typing import Any


def main() -> None:
    here = Path(__file__).parent.resolve()
    django_root = here.parent.parent.resolve()
    there = (django_root / "fixtures").resolve()

    # Break early if anything has moved unexpectedly:
    assert here.name == "section-schemas"
    assert here == django_root / "utils" / "section-schemas"

    docs = here.glob("*-section-*.json")
    fixtures = there.glob("*-section-*.json")

    for doc, fixture in zip(docs, fixtures):
        doc_json, fixture_json = load_json(doc), load_json(fixture)
        contents = fixture_json[0]["fields"]["contents"]
        if doc_json != contents:
            print("doc_json/fixture mismatch", flush=True)


def load_json(path: Path) -> Any:
    return json.loads(path.read_text())


if __name__ == "__main__":
    main()
