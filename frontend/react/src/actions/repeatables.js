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

  // When referenced, the previous ID should be enclosed in quotes, but it
  // could be either single or double quotes, and the previous ID may be
  // followed by a dash, to reference something deeper in the tree. We need
  // to account for those scenarios, so replace the previous ID when it preceded
  // by a single or double quote and followed by a single or double quote or
  // a dash.
  newItem = newItem.replace(
    new RegExp(`("|')${previousId}("|'|-)`, "g"),
    `$1${newId}$2`
  );

  newItem = JSON.parse(newItem);

  // Set all the answers throughout the new item to null.
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

export const removeRepeatable = (parentId) => (dispatch, getState) => {
  const state = getState();
  const parent = selectById(state, parentId);

  if (parent.questions.length > 1) {
    dispatch({
      type: SET_FRAGMENT,
      id: parentId,
      value: {
        ...parent,
        questions: parent.questions.slice(0, parent.questions.length - 1),
      },
    });
  }
};

// 287
