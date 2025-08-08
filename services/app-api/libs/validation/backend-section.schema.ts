export const sectionSchema = {
  definitions: {
    section: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        type: {
          const: "section",
        },
        title: {
          type: ["string", "null"],
        },
        ordinal: {
          type: "integer",
        },
        valid: {
          type: ["boolean", "null"],
        },
        state: {
          type: ["string", "null"],
        },
        year: {
          type: ["integer"],
        },
        subsections: {
          type: "array",
          items: {
            $ref: "#/definitions/subsection",
          },
        },
      },
      additionalProperties: false,
      required: ["id", "year", "subsections"],
    },
    subsection: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        type: {
          const: "subsection",
        },
        title: {
          type: "string",
        },
        text: {
          type: "string",
        },
        description: {
          type: "string",
        },
        parts: {
          type: "array",
          items: {
            $ref: "#/definitions/part",
          },
        },
      },
      additionalProperties: false,
      required: ["id", "parts"],
    },
    part: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        type: {
          const: "part",
        },
        title: {
          type: "string",
        },
        text: {
          type: "string",
        },
        description: {
          type: "string",
        },
        comment: {
          type: "string",
        },
        context_data: {
          $ref: "#/definitions/context_data",
        },
        questions: {
          type: "array",
          items: {
            anyOf: [
              {
                $ref: "#/definitions/fieldset",
              },
              {
                $ref: "#/definitions/repeatables",
              },
              {
                $ref: "#/definitions/objectives",
              },
              {
                $ref: "#/definitions/question",
              },
            ],
          },
        },
      },
      additionalProperties: false,
      required: ["id", "type"],
    },
    context_data: {
      type: "object",
      properties: {
        bullet_text: {
          type: "string",
        },
        comment: {
          type: "string",
        },
        display_prior_year_data: {
          type: "boolean",
        },
        enable_copying_prior_year_data: {
          type: "boolean",
        },
        interactive_conditional: {
          type: "string",
        },
        noninteractive_conditional: {
          type: "string",
        },
        skip_text: {
          type: "string",
        },
        conditional_display: {
          $ref: "#/definitions/conditional_display",
        },
        show_if_state_program_type_in: {
          $ref: "#/definitions/show_if_state_program_type_in",
        },
      },
      additionalProperties: false,
    },
    show_if_state_program_type_in: {
      type: "array",
      items: {
        type: "string",
        enum: ["medicaid_exp_chip", "separate_chip", "combo"],
      },
    },
    objectives: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        type: {
          const: "objectives",
        },
        comment: {
          type: "string",
        },
        questions: {
          type: "array",
          items: {
            $ref: "#/definitions/objective",
          },
        },
      },
      additionalProperties: false,
      required: ["id", "type"],
    },
    objective: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        type: {
          const: "objective",
        },
        comment: {
          type: "string",
        },
        suggested: {
          type: "boolean",
        },
        questions: {
          type: "array",
          items: {
            anyOf: [
              {
                $ref: "#/definitions/question",
              },
              {
                $ref: "#/definitions/repeatables",
              },
            ],
          },
          additionalItems: {
            $ref: "#/definitions/repeatables",
          },
        },
      },
      additionalProperties: false,
      required: ["id", "type"],
    },
    repeatables: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        type: {
          const: "repeatables",
        },
        typeLabel: {
          type: "string",
        },
        comment: {
          type: "string",
        },
        addAnotherText: {
          type: ["string", "null"],
        },
        hideOptionalHint: {
          type: ["boolean", "null"],
        },
        questions: {
          type: "array",
          items: {
            $ref: "#/definitions/repeatable",
          },
        },
      },
      additionalProperties: false,
      required: ["id", "type"],
    },
    repeatable: {
      type: "object",
      properties: {
        id: {
          type: "string",
        },
        type: {
          const: "repeatable",
        },
        comment: {
          type: "string",
        },
        questions: {
          type: "array",
          items: {
            anyOf: [
              {
                $ref: "#/definitions/question",
              },
              {
                $ref: "#/definitions/fieldset",
              },
            ],
          },
        },
      },
      additionalProperties: false,
      required: ["id", "type"],
    },
    question: {
      type: "object",
      if: {
        properties: {
          type: {
            const: "ranges",
          },
        },
      },
      then: {
        properties: {
          id: {
            type: "string",
          },
          label: {
            type: "string",
          },
          comment: {
            type: "string",
          },
          answer: {
            $ref: "#/definitions/answer_ranges",
          },
          context_data: {
            $ref: "#/definitions/context_data",
          },
          type: {
            anyOf: [
              {
                const: "daterange",
              },
              {
                const: "ranges",
              },
            ],
          },
          hint: {
            type: "string",
          },
          questions: {
            type: "array",
            items: {
              anyOf: [
                {
                  $ref: "#/definitions/question",
                },
                {
                  $ref: "#/definitions/fieldset",
                },
              ],
            },
          },
        },
        additionalProperties: false,
      },
      else: {
        properties: {
          id: {
            type: "string",
          },
          label: {
            type: "string",
          },
          comment: {
            type: "string",
          },
          answer: {
            $ref: "#/definitions/answer",
          },
          context_data: {
            $ref: "#/definitions/context_data",
          },
          type: {
            enum: [
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
            ],
          },
          hint: {
            type: "string",
          },
          mask: {
            type: "string",
          },
          questions: {
            type: "array",
            items: {
              anyOf: [
                {
                  $ref: "#/definitions/question",
                },
                {
                  $ref: "#/definitions/fieldset",
                },
              ],
            },
          },
        },
        additionalProperties: false,
      },
      required: ["id", "type", "answer"],
    },
    fieldset: {
      type: "object",
      properties: {
        type: {
          const: "fieldset",
        },
        comment: {
          type: "string",
        },
        label: {
          type: "string",
        },
        hint: {
          type: "string",
        },
        fieldset_type: {
          enum: [
            "datagrid",
            "datagrid_with_total",
            "marked",
            "noninteractive_table",
            "sum",
            "synthesized_table",
            "synthesized_value",
            "unmarked_descendants",
          ],
        },
        fieldset_info: {
          type: "object",
        },
        fieldset_id: {
          type: "string",
        },
        context_data: {
          $ref: "#/definitions/context_data",
        },
        questions: {
          type: "array",
          items: {
            anyOf: [
              {
                $ref: "#/definitions/question",
              },
              {
                $ref: "#/definitions/fieldset",
              },
            ],
          },
        },
        // If true, this prevents the first column from being bolded
        all_columns_have_data: {
          type: ["bool", "null"],
        },
      },
      required: ["type", "questions"],
      additionalProperties: false,
    },
    conditional_display: {
      type: "object",
      properties: {
        type: {
          const: "conditional_display",
        },
        comment: {
          type: "string",
        },
        skip_text: {
          type: "string",
        },
        hide_if: {
          type: "object",
          properties: {
            target: {
              type: "string",
            },
            comment: {
              type: "string",
            },
            values: {
              type: "object",
              properties: {
                interactive: {
                  type: "array",
                  items: {
                    anyOf: [
                      {
                        type: "number",
                      },
                      {
                        type: "null",
                      },
                      {
                        type: "string",
                      },
                      {
                        type: "boolean",
                      },
                    ],
                  },
                },
                noninteractive: {
                  type: "array",
                  items: {
                    anyOf: [
                      {
                        type: "number",
                      },
                      {
                        type: "null",
                      },
                      {
                        type: "string",
                      },
                      {
                        type: "boolean",
                      },
                    ],
                  },
                },
              },
              required: ["interactive", "noninteractive"],
            },
          },
          required: ["target", "values"],
        },
        hide_if_all: {
          type: "object",
          properties: {
            targets: {
              type: "array",
              items: {
                type: "string",
              },
            },
            comment: {
              type: "string",
            },
            values: {
              type: "object",
              properties: {
                interactive: {
                  type: "array",
                  items: {
                    anyOf: [
                      {
                        type: "number",
                      },
                      {
                        type: "null",
                      },
                      {
                        type: "string",
                      },
                      {
                        type: "boolean",
                      },
                    ],
                  },
                },
                noninteractive: {
                  type: "array",
                  items: {
                    anyOf: [
                      {
                        type: "number",
                      },
                      {
                        type: "null",
                      },
                      {
                        type: "string",
                      },
                      {
                        type: "boolean",
                      },
                    ],
                  },
                },
              },
              required: ["interactive", "noninteractive"],
            },
          },
          required: ["targets", "values"],
        },
        hide_if_not: {
          type: "object",
          properties: {
            target: {
              type: "string",
            },
            comment: {
              type: "string",
            },
            values: {
              type: "object",
              properties: {
                interactive: {
                  type: "array",
                  items: {
                    anyOf: [
                      {
                        type: "number",
                      },
                      {
                        type: "null",
                      },
                      {
                        type: "string",
                      },
                      {
                        type: "boolean",
                      },
                    ],
                  },
                },
                noninteractive: {
                  type: "array",
                  items: {
                    anyOf: [
                      {
                        type: "number",
                      },
                      {
                        type: "null",
                      },
                      {
                        type: "string",
                      },
                      {
                        type: "boolean",
                      },
                    ],
                  },
                },
              },
              required: ["interactive", "noninteractive"],
            },
          },
          required: ["target", "values"],
        },
        hide_if_table_value: {
          type: "object",
          properties: {
            target: {
              type: "string",
            },
            comment: {
              type: "string",
            },
            computed: {
              type: "boolean",
            },
            variation_operator: {
              type: "string",
            },
            variations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  threshold: {
                    type: "string",
                  },
                  operator: {
                    type: "string",
                  },
                  row: {
                    type: "string",
                  },
                  row_key: {
                    type: "string",
                  },
                },
              },
              required: ["threshold", "operator", "computed", "row", "row_key"],
            },
          },
          required: ["target", "variation_operator", "variations"],
        },
      },
      additionalProperties: false,
      required: ["type"],
      oneOf: [
        {
          required: ["hide_if"],
        },
        {
          required: ["hide_if_all"],
        },
        {
          required: ["hide_if_not"],
        },
        {
          required: ["hide_if_table_value"],
        },
      ],
    },
    answer: {
      type: "object",
      properties: {
        entry: {
          type: ["array", "integer", "null", "number", "string", "object"],
        },
        default_entry: {
          type: ["null", "string", "number"],
        },
        labels: {
          type: "array",
          items: {
            type: "string",
          },
        },
        header: {
          type: "string",
        },
        prepopulated: {
          type: "boolean",
        },
        readonly: {
          type: "boolean",
        },
        options: {
          $ref: "#/definitions/options",
        },
      },
      additionalProperties: false,
      required: ["entry"],
    },
    answer_ranges: {
      type: "object",
      properties: {
        entry: {
          type: ["array", "integer", "null", "number", "string", "object"],
        },
        default_entry: {
          type: ["null", "string", "number"],
        },
        labels: {
          type: "array",
          items: {
            type: "string",
          },
        },
        header: {
          type: "string",
        },
        range_categories: {
          type: "array",
        },
        range_type: {
          type: "array",
        },
        entry_min: {
          type: "integer",
        },
        entry_max: {
          type: "integer",
        },
        options: {
          $ref: "#/definitions/options",
        },
      },
      additionalProperties: false,
      required: ["entry"],
    },
    options: {
      type: "array",
      items: {
        type: "object",
        properties: {
          label: {
            type: "string",
          },
          value: {
            type: "string",
          },
        },
        required: ["label", "value"],
      },
    },
  },
  type: "object",
  properties: {
    section: {
      $ref: "#/definitions/section",
    },
  },
};
