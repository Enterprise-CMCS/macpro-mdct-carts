import json
import jsonschema
from pathlib import Path


def main() -> None:
    here = Path(".")
    there = Path("..", "..", "frontend", "api_postgres", "fixtures")
    schema = json.loads(Path(here, "backend-section.schema.json").read_text())
    schemafixture = transform("carts_api.sectionschema", schema)
    schemapath = Path(there, "backend-section.schema.json")
    schemapath.write_text(json.dumps(schemafixture))

    def etl(fpath, modelname):
        orig = json.loads(fpath.read_text())
        jsonschema.validate(schema=schema, instance=orig)
        # output = transform("carts_api.sectionbase", orig)
        output = transform(modelname, orig)
        outpath = Path(there, f.name)
        outpath.write_text(json.dumps(output))

    for f in here.glob("backend-json-section-*.json"):
        etl(f, "carts_api.sectionbase")

    for f in here.glob("2020-*.json"):
        etl(f, "carts_api.section")


def transform(model, orig):
    entries = []
    models = {
        "carts_api.sectionschema": {
            "model": "carts_api.sectionschema",
            "fields": {
                "year": 2020
            }
        },
        "carts_api.sectionbase": {
            "model": "carts_api.sectionbase",
            "fields": {}
        },
        "carts_api.section": {
            "model": "carts_api.section",
            "fields": {}
        }
    }
    entry = models[model]
    entry["fields"]["contents"] = orig
    entries.append(entry)
    return entries


if __name__ == '__main__':
    main()

