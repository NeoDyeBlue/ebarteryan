import * as yup from "yup";
import * as fileChecker from "../../utils/filecheck-utils";

// https://stackoverflow.com/questions/54020719/validating-file-size-and-format-with-yup/54562649#54562649

export const listingCreationSchema = yup.object().shape({
  images: yup
    .array()
    .nullable()
    .min(1, "At least 1 picture is required")
    .required("Required")
    .test("is-files-big", "A file is too big", (files) =>
      fileChecker.isFileSizesTooBig(files, 10)
    )
    .test("is-types-correct", "A file type is not supported", (files) =>
      fileChecker.isFileTypesCorrect(files, [
        "image/jpeg",
        "image/png",
        "image/gif",
      ])
    ),
  name: yup.string().required("Required"),
  exchangeFor: yup.string().required("Required"),
  description: yup.string().required("Required"),
  // priceRangeValue: yup.object().shape({
  //   min: yup
  //     .number()
  //     .required("Min field is required")
  //     .test(
  //       "min-max",
  //       "Min field must be less than Max field",
  //       function (value) {
  //         const maxFieldValue = this.resolve(yup.ref("max"));
  //         return value < maxFieldValue;
  //       }
  //     ),
  //   max: yup
  //     .number()
  //     .required("Max field is required")
  //     .test(
  //       "min-max",
  //       "Max field must be greater than Min field",
  //       function (value) {
  //         const minFieldValue = this.resolve(yup.ref("min"));
  //         return value > minFieldValue;
  //       }
  //     ),
  // }),
  priceValue: yup.number().min(0).required("Required"),
  condition: yup
    .string()
    .oneOf(["new", "old", "slightly used", "mostly used", "broken"])
    .required("Required"),
  draft: yup.boolean(),
  category: yup.string().required("Required"),
  claimingOptions: yup
    .array()
    .nullable()
    .of(yup.string().oneOf(["meetup", "delivery", "undecided"]))
    .min(1, "Select at least one option")
    .required("Required"),
  location: yup
    .object()
    .shape({
      region: yup.string().required("Region is not set"),
      lat: yup.number().required("Location is not fully set"),
      lng: yup.number().required("Location is not fully set"),
    })
    .nullable()
    .required("Required"),
});

export const offerSchema = yup.object().shape({
  images: yup
    .array()
    .nullable()
    .min(1, "At least 1 picture is required")
    .required("Required")
    .test("is-files-big", "A file is too big", (files) =>
      fileChecker.isFileSizesTooBig(files, 10)
    )
    .test("is-types-correct", "A file type is not supported", (files) =>
      fileChecker.isFileTypesCorrect(files, [
        "image/jpeg",
        "image/png",
        "image/gif",
      ])
    ),
  name: yup.string().required("Required"),
  description: yup.string().required("Required"),
  condition: yup
    .string()
    .oneOf(["new", "old", "slightly used", "mostly used", "broken"])
    .required("Required"),
  location: yup
    .object()
    .shape({
      region: yup.string().required("Region is not set"),
      lat: yup.number().required("Location is not fully set"),
      lng: yup.number().required("Location is not fully set"),
    })
    .nullable()
    .required("Required"),
});
