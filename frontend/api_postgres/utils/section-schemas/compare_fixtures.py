"""
The contents of the JSON in the docs/section-schemas files should match the
contents of the fields.contents property in the fixture files.
"""
import json
from pathlib import Path
from typing import Any


def main() -> None:
    project_root = Path("..", "..")
    here = Path(".")

    # Break early if anything has moved unexpectedly:
    assert here == project_root / "docs" / "section-schemas"

    there = project_root / "frontend" / "api_postgres" / "fixtures"

    docs = here.glob("*-section-*.json")
    fixtures = there.glob("*-section-*.json")

    for doc, fixture in zip(docs, fixtures):
        doc_json, fixture_json = load_json(doc), load_json(fixture)
        contents = fixture_json[0]["fields"]["contents"]
        assert doc_json == contents


def load_json(path: Path) -> Any:
    return json.loads(path.read_text())


if __name__ == "__main__":
    main()
