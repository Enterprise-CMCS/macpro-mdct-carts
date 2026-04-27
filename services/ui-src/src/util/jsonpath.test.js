const buildData = () => ({
  meta: {
    direct: "direct-value",
  },
  formData: [
    {
      contents: {
        section: {
          title: "unused section",
          subsections: [],
        },
      },
    },
    {
      contents: {
        section: {
          title: "Section title",
          subsections: [
            {
              name: "Subsection A",
              parts: [
                {
                  label: "Part 1",
                  questions: [
                    {
                      id: "2020-01-a-01-01",
                      answer: {
                        entry: "original",
                      },
                      options: ["first", "second"],
                    },
                    {
                      id: "2020-01-a-01-02",
                      answer: {
                        entry: "other",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    },
  ],
});

const loadJsonpath = () => {
  jest.resetModules();
  return require("./jsonpath").default;
};

const questionPath = "$..questions[?(@.id==='2020-01-a-01-01')].answer.entry";

describe("jsonpath wrapper", () => {
  test("Returns appropriate section, subsection, part, and question lookups", () => {
    const jsonpath = loadJsonpath();
    const data = buildData();

    expect(jsonpath.query(data, "$..*[?(@.id==='2020-01')].title")).toEqual([
      "Section title",
    ]);
    expect(jsonpath.query(data, "$..*[?(@.id==='2020-01-a')].name")).toEqual([
      "Subsection A",
    ]);
    expect(
      jsonpath.query(data, "$..*[?(@.id==='2020-01-a-01')].label")
    ).toEqual(["Part 1"]);
    expect(jsonpath.query(data, questionPath)).toEqual(["original"]);
  });

  test("uses the original path when no id filter is present and reuses cached exact paths", () => {
    const jsonpath = loadJsonpath();
    const data = buildData();

    expect(jsonpath.query(data, "$..*[?(@.id==='2020')].meta.direct")).toEqual([
      "direct-value",
    ]);
    expect(jsonpath.query(data, "$.meta.direct")).toEqual(["direct-value"]);
    expect(jsonpath.query(data, questionPath)).toEqual(["original"]);

    data.formData[1].contents.section.subsections[0].parts[0].questions[0].answer.entry =
      "updated";

    expect(jsonpath.query(data, questionPath)).toEqual(["updated"]);
  });

  test("preserves wildcard queries when caching an exact path", () => {
    const jsonpath = loadJsonpath();
    const data = buildData();

    expect(
      jsonpath.query(
        data,
        "$..questions[?(@.id==='2020-01-a-01-01')].options[*]"
      )
    ).toEqual(["first", "second"]);
  });

  test("falls back to the original path when no exact path exists", () => {
    const jsonpath = loadJsonpath();
    const data = buildData();

    expect(jsonpath.query(data, "$.missing.value")).toEqual([]);

    data.missing = { value: "later" };

    expect(jsonpath.query(data, "$.missing.value")).toEqual(["later"]);
  });

  test("wraps apply, nodes, parent, paths, and value", () => {
    const jsonpath = loadJsonpath();
    const data = buildData();

    const applied = jsonpath.apply(data, questionPath, (value) => `${value}!`);
    expect(applied).toHaveLength(1);
    expect(applied[0].value).toBe("original!");
    expect(jsonpath.query(data, questionPath)).toEqual(["original!"]);

    const rootApply = jsonpath.apply(data, "$", () => "root-replacement");
    expect(rootApply).toHaveLength(1);
    expect(rootApply[0].value).toBe("root-replacement");

    const nodes = jsonpath.nodes(data, questionPath);
    expect(nodes).toHaveLength(1);
    expect(nodes[0].value).toBe("original!");
    expect(nodes[0].path.at(-1)).toBe("entry");

    const parent = jsonpath.parent(data, questionPath);
    expect(parent).toEqual({ entry: "original!" });

    const paths = jsonpath.paths(data, questionPath);
    expect(paths).toHaveLength(1);
    expect(paths[0].at(-1)).toBe("entry");

    expect(jsonpath.value(data, questionPath)).toBe("original!");
    expect(jsonpath.value(data, questionPath, "changed")).toBe("changed");
    expect(jsonpath.value(data, questionPath)).toBe("changed");

    expect(jsonpath.value(data, "$.meta.created", "new-value")).toBe(
      "new-value"
    );
    expect(data.meta.created).toBe("new-value");

    expect(jsonpath.value(data, "$.newBranch.leaf", "branch-value")).toBe(
      "branch-value"
    );
    expect(data.newBranch.leaf).toBe("branch-value");

    expect(jsonpath.value(data, "$.list[0].name", "list-value")).toBe(
      "list-value"
    );
    expect(data.list[0].name).toBe("list-value");

    expect(jsonpath.value(data, "$", "ignored-root-update")).toBeUndefined();
  });

  test("exposes parse and stringify helpers", () => {
    const jsonpath = loadJsonpath();

    expect(typeof jsonpath.parse).toBe("function");
    expect(typeof jsonpath.stringify).toBe("function");
  });
});
