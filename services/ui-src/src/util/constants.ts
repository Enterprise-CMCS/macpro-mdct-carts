/* eslint-disable no-unused-vars */
// import.meta.env is threaded through here in order to mock it out for jest
export const { MODE, BASE_URL } = import.meta.env;

export enum Mask {
  lessThanEleven = "lessThanEleven",
}
