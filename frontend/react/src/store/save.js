import { SAVE_FINISHED, SAVE_STARTED } from "./saveMiddleware";

const initial = {
  error: false,
  errorMessage: null,
  lastSave: null,
  saving: false,
};

export default (state = initial, action) => {
  switch (action.type) {
    case SAVE_STARTED:
      return {
        ...state,
        saving: true,
      };

    case SAVE_FINISHED:
      return {
        error: action.error,
        errorMessage: action.errorMessage,
        lastSave: action.error ? state.lastSave : new Date(),
        saving: false,
      };

    default:
      return state;
  }
};
