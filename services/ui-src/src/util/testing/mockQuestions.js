import { questionTypes } from "../../components/fields/Question";

// Temporarily exclude these question types
const excludedTypes = ["file_upload", "objectives", "repeatables"];
export const mockQuestionTypes = Array.from(questionTypes.keys()).filter(
  (key) => !excludedTypes.includes(key)
);
export const mockQuestions = Object.fromEntries(
  mockQuestionTypes.map((key) => [key, {}])
);
export const mockQuestionProps = Object.fromEntries(
  mockQuestionTypes.map((key) => [key, {}])
);

mockQuestionTypes.forEach((type, index) => {
  mockQuestions[type] = {
    id: `${index + 1}`,
    type,
    label: `Mock ${type} question`,
    name: `mock-${type}`,
    answer: {},
  };
});

["checkbox", "radio"].forEach((type) => {
  mockQuestions[type] = {
    ...mockQuestions[type],
    answer: {
      options: [
        {
          label: `Mock ${type} answer`,
          value: `mock-${type}-answer`,
        },
      ],
    },
  };
});

[
  "checkbox_flag",
  "email",
  "text",
  "text_medium",
  "text_multiline",
  "text_small",
].forEach((type) => {
  mockQuestions[type] = {
    ...mockQuestions[type],
    answer: { entry: `Mock ${type} answer` },
  };
});
mockQuestionProps["checkbox_flag"] = {
  onChange: () => {},
};

["integer", "money", "phone_number", "percentage"].forEach((type) => {
  mockQuestions[type] = {
    ...mockQuestions[type],
    answer: { entry: 5555555555 },
  };
});

mockQuestions["fieldset"] = {
  ...mockQuestions["fieldset"],
  fieldset_info: {
    id: "mock-fieldset_info",
  },
  questions: [mockQuestions["integer"], mockQuestions["text"]],
};

mockQuestions["daterange"] = {
  ...mockQuestions["daterange"],
  answer: {
    entry: "Mock daterange answer",
    labels: ["Mock daterange start", "Mock daterange end"],
  },
};
mockQuestionProps["daterange"] = {
  onChange: () => {},
};

mockQuestions["ranges"] = {
  ...mockQuestions["ranges"],
  answer: {
    entry: [],
    entry_max: "",
    entry_min: "",
    header: "",
    range_categories: [[]],
    range_type: [],
  },
};
mockQuestionProps["ranges"] = {
  onChange: () => {},
};

mockQuestions["skip_text"] = {
  ...mockQuestions["text"],
  skip_text: "Mock skip text",
};
