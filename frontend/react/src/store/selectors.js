import jsonpath from "jsonpath";

export const selectQuestion = (state, id) => {
  const jp = `$..[*].contents.section.subsections[*].parts[*].questions[?(@.id=='${id}')]`;
  const questions = jsonpath.query(state, jp);
  if(questions.length) {
    return questions[0];
  }
  return null;
}
