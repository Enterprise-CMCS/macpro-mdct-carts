import jsonpath from "jsonpath";

import { selectById } from "../store/selectors";

export const SET_FRAGMENT = "set fragment";

const incrementId = (id) => {
  const idParts = id.split("-");
  const lastPart = +idParts.pop() + 1;

  idParts.push(`${lastPart < 10 ? "0" : ""}${lastPart}`);
  return idParts.join("-");
};

export const createNewRepeatable = (parentId) => (dispatch, getState) => {
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

  dispatch({
    type: SET_FRAGMENT,
    id: parentId,
    value: { ...parent, questions: [...parent.questions, newItem] },
  });
};

export const createNewObjective = (parentId) => (dispatch, getState) => {
  const state = getState();
  const parent = selectById(state, parentId);

  const previousId = parent.questions[parent.questions.length - 1].id;

  let newObjective = JSON.stringify(
    parent.questions[parent.questions.length - 1]
  );

  const newObjectiveId = incrementId(previousId);

  newObjective = newObjective.replace(
    new RegExp(`"${previousId}("|-)`, "g"),
    `"${newObjectiveId}$1`
  );

  newObjective = JSON.parse(newObjective);

  delete newObjective.questions[0].answer.default_entry;
  delete newObjective.questions[0].answer.readonly;

  jsonpath.apply(
    newObjective,
    "$..questions[?(@.answer.entry)].answer.entry",
    () => null
  );

  dispatch({
    type: SET_FRAGMENT,
    id: parentId,
    value: { ...parent, questions: [...parent.questions, newObjective] },
  });
};
