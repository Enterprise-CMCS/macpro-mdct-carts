import json
from jsonpath_ng.ext import parse  # type: ignore
from pathlib import Path


def main() -> None:
    here = Path(".")
    for f in here.glob("backend-json-section-*.json"):
        orig = json.loads(f.read_text())
        output = transform(orig)
        f.write_text(json.dumps(output, indent=2))


def transform(orig):
    keys = [
        "bullet_text",
        "interactive_conditional",
        "noninteractive_conditional",
        "skip_text",
        "conditional_display",
        "show_if_state_program_type_in",
    ]
    for k in keys:
        findkey = parse(f"$..*[?(@.{k})]")
        found = findkey.find(orig)
        for item in found:
            chg = {**item.value}
            if "context_data" not in chg:
                chg["context_data"] = {}
            chg["context_data"][k] = chg[k]
            chg[k] = ""
            del chg[k]
            item.full_path.update(orig, chg)

    return orig


if __name__ == "__main__":
    main()
