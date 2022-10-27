import { Formik, Form } from "formik";
import {
  InputField,
  ImageSelector,
  Textarea,
  RadioSelect,
  RadioSelectItem,
} from "../Inputs";
import { IconDescription } from "../Icons";
import { LocationModal } from "../Modals";
import { Collaborate, Delivery, Chat, Location } from "@carbon/icons-react";
import { Button } from "../Buttons";
import ReactModal from "react-modal";
import useMapStore from "../../store/useMapStore";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
const DropdownSelect = dynamic(() => import("../Inputs/DropdownSelect"), {
  ssr: false,
});
import { memo } from "react";
import { listingCreationSchema } from "../../lib/validators/item-validator";

const MemoizedImageSelector = memo(ImageSelector);

export default function CreateListingForm() {
  function handleSubmit() {
    console.log("submitted");
  }
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 py-6 md:mb-6">
      <h1 className="text-2xl font-semibold">Make a Barter</h1>
      <Formik
        initialValues={{
          images: [],
          itemName: "",
          exchangeFor: "",
          description: "",
          offeringTime: "",
          claimingOptions: {
            toBeDecided: false,
            delivery: false,
            meetup: false,
          },
          category: "",
          condition: "",
          location: {
            region: "",
            lat: 0,
            lng: 0,
          },
        }}
        validationSchema={listingCreationSchema}
        onSubmit={handleSubmit}
      >
        {(props) => {
          // const handleImageSelectorChange = useCallback(
          //   (images) => {
          //     props.setFieldValue("images", images);
          //   },
          //   [props.values.images]
          // );

          const handleCategoryChange = useCallback(
            (item) => {
              props.setFieldValue("category", item);
            },
            [props.values.category]
          );

          return (
            <Form className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <p className="border-b border-gray-100 pb-2 text-sm text-gray-300">
                  Details
                </p>
                <MemoizedImageSelector
                  name="images"
                  label="Upload Photos"
                  // values={props.values.images}
                  max={10}
                  infoMessage="You can upload up to 10 photos only."
                  // onChange={handleImageSelectorChange}
                />
                <InputField type="text" name="itemName" label="Item Name" />
                <Textarea
                  label="Exchange For"
                  name="exchangeFor"
                  // placeholder={"What do you want in exchange?"}
                />
                <Textarea
                  label="Description"
                  name="description"
                  // placeholder={"Item description"}
                />
                <DropdownSelect
                  name="category"
                  items={["1", "2", "3"]}
                  placeholder="Select a category"
                  label="Category"
                />
                <RadioSelect
                  label="Condition"
                  error={
                    props.errors.condition && props.touched.condition
                      ? props.errors.condition
                      : null
                  }
                >
                  <RadioSelectItem
                    name="condition"
                    value="new"
                    checked={props.values.condition == "new"}
                  >
                    New
                  </RadioSelectItem>
                  <RadioSelectItem
                    name="condition"
                    value="slightly_used"
                    checked={props.values.condition == "slightly_used"}
                  >
                    Slightly used
                  </RadioSelectItem>
                  <RadioSelectItem
                    name="condition"
                    value="mostly_used"
                    checked={props.values.condition == "mostly_used"}
                  >
                    Mostly used
                  </RadioSelectItem>
                  <RadioSelectItem
                    name="condition"
                    value="old"
                    checked={props.values.condition == "old"}
                  >
                    Old
                  </RadioSelectItem>
                  <RadioSelectItem
                    name="condition"
                    value="broken"
                    checked={props.values.condition == "broken"}
                  >
                    Broken
                  </RadioSelectItem>
                </RadioSelect>
              </div>
              <Button type="submit">Done</Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
