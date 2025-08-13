import { questionTypes } from "../../components/fields/Question";

export const mockQuestionTypes = Array.from(questionTypes.keys());
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

["email", "text", "text_medium", "text_multiline", "text_small"].forEach(
  (type) => {
    mockQuestions[type] = {
      ...mockQuestions[type],
      answer: { entry: `Mock ${type} answer` },
    };
  }
);

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

mockQuestions["objectives"] = {
  ...mockQuestions["objectives"],
  questions: [
    {
      ...mockQuestions["checkbox"],
      questions: [mockQuestions["integer"], mockQuestions["text"]],
    },
  ],
};
mockQuestionProps["objectives"] = {
  addObjectiveTo: () => {},
  disabled: false,
  removeObjectiveFrom: () => {},
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

mockQuestions["repeatables"] = {
  ...mockQuestions["repeatables"],
  questions: [mockQuestions["integer"], mockQuestions["text"]],
};
mockQuestionProps["repeatables"] = {
  addRepeatableTo: () => {},
  disabled: false,
  removeRepeatableFrom: () => {},
};

mockQuestions["skip_text"] = {
  ...mockQuestions["text"],
  skip_text: "Mock skip text",
};
