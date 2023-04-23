import * as yup from "yup";

export const questionSchema = yup.object().shape({
  question: yup.string().required("You haven't typed a question"),
});

export const answerSchema = yup.object().shape({
  answer: yup.string().required("You haven't typed your answer"),
});
