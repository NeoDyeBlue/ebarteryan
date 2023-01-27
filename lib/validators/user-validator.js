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
    .test("is-file-or-url", "The image must be a file or a URL", (value) => {
      if (value) {
        if (value instanceof File) {
          return true;
        }
        if (typeof value === "string") {
          try {
            new URL(value);
            return true;
          } catch (err) {
            return false;
          }
        }
      }
      return false;
    })
    .test("valid-file-type", "The file must be an image", (value) => {
      if (value instanceof File) {
        return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
      }
      return true;
    })
    .test("valid-file-size", "The file size must be less than 2mb", (value) => {
      if (value instanceof File) {
        return value.size < 2 * 1024 * 1024;
      }
      return true;
    }),
  firstName: yup.string().required("Required"),
  lastName: yup.string().required("Required"),
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

export const passwordResetSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("Required"),
});

export const newPassworSchema = yup.object().shape({
  password: yup
    .string()
    .required("Required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords do not match")
    .required("Required"),
});
