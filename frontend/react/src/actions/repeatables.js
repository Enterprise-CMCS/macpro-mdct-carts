import jsonpath from "jsonpath";

import { selectById } from "../store/selectors";

export const SET_FRAGMENT = "set fragment";

const incrementId = (id) => {
  const idParts = id.split("-");
  const lastPart = +idParts.pop() + 1;

  idParts.push(`${lastPart < 10 ? "0" : ""}${lastPart}`);
  return idParts.join("-");
};

const createNewRepeatableItem = (parentId, getState) => {
  const state = getState();
  const parent = selectById(state, parentId);

  const previousId = parent.questions[parent.questions.length - 1].id;

  let newItem = JSON.stringify(parent.questions[parent.questions.length - 1]);
  const newId = incrementId(previousId);

  newItem = newItem.replace(
    new RegExp(`"${previousId}("|-)`, "g"),
    `"${newId}$1`
  );

  newItem = JSON.parse(newItem);

  jsonpath.apply(
    newItem,
    "$..questions[?(@.answer.entry)].answer.entry",
    () => null
  );

  return { parent, newItem };
};

export const createNewRepeatable = (parentId) => (dispatch, getState) => {
  const { parent, newItem } = createNewRepeatableItem(parentId, getState);

  dispatch({
    type: SET_FRAGMENT,
    id: parentId,
    value: { ...parent, questions: [...parent.questions, newItem] },
  });
};

export const createNewObjective = (parentId) => (dispatch, getState) => {
  const { parent, newItem } = createNewRepeatableItem(parentId, getState);

  delete newItem.questions[0].answer.default_entry;
  delete newItem.questions[0].answer.readonly;
  // Truncate the goals down to just one
  newItem.questions[1].questions.length = 1;

  dispatch({
    type: SET_FRAGMENT,
    id: parentId,
    value: { ...parent, questions: [...parent.questions, newItem] },
  });
};
