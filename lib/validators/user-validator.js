import * as yup from "yup";
import * as fileChecker from "../../utils/filecheck-utils";

export const loginSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("Required"),
  password: yup.string().required("Required"),
});

export const signupSchema = yup.object().shape({
  firstName: yup.string().required("Required"),
  lastName: yup.string(),
  email: yup.string().email("Please enter a valid email").required("Required"),
  password: yup
    .string()
    .required("Required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords do not match")
    .required("Required"),
});

export const profileSchema = yup.object().shape({
  image: yup
    .mixed()
    .nullable()
    .test("is-file-big", "Image is too big", (files) =>
      fileChecker.isFileSizesTooBig(files, 10)
    )
    .test("is-type-correct", "File type is not supported", (files) =>
      fileChecker.isFileTypesCorrect(files, [
        "image/jpeg",
        "image/png",
        "image/gif",
      ])
    )
    .required("Required"),
  firstName: yup.string().required("Required"),
  lastName: yup.string(),
});

export const accountSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("Required"),
  password: yup
    .string()
    .required("Required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords do not match")
    .required("Required"),
});
