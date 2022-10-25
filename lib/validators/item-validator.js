import * as yup from "yup";
import * as fileChecker from "../../utils/filecheck-utils";

// https://stackoverflow.com/questions/54020719/validating-file-size-and-format-with-yup/54562649#54562649

export const listingCreationSchema = yup.object().shape({
  images: yup
    .array()
    .min(1, "At least 1 picture is required")
    .nullable()
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
  itemName: yup.string().required("Required"),
  exchangeFor: yup.string().required("Required"),
  description: yup.string().required("Required"),
  condition: yup
    .string()
    .oneOf(["new", "old", "slightly_used", "mostly_used", "broken"])
    .required("Required"),
  category: yup.string().required("Required"),
  offeringTime: yup.string().required("Required"),
  claimingOptions: yup
    .object()
    .shape({
      undecided: yup.boolean(),
      delivery: yup.boolean(),
      meetup: yup.boolean(),
    })
    .nullable()
    .required("Required"),
  location: yup
    .object()
    .shape({
      region: yup.string().required("Full location is required"),
      lat: yup.number().required("Full location is required"),
      lng: yup.number().required("Full location is required"),
    })
    .nullable()
    .required("Required"),
});
