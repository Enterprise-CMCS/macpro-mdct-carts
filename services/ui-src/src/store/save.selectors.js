export const selectHasError = (state) => state.save.error;

export const selectIsSaving = (state) => state.save.saving;

export const selectLastSave = (state) => state.save.lastSave;

export const selectSaveError = (state) =>
  state.save.error ? state.save.errorMessage : null;
