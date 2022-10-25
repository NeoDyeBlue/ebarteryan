import { Formik, Form } from "formik";
import { InputField, MemoizedImageSelector, Textarea } from "../Inputs";
import { IconDescription } from "../Icons";
import { LocationModal } from "../Modals";
import { Collaborate, Delivery, Chat, Location } from "@carbon/icons-react";
import { Button } from "../Buttons";
import ReactModal from "react-modal";
import useMapStore from "../../store/useMapStore";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
const DropdownSelect = dynamic(() => import("../Inputs"), {
  ssr: false,
});
import { listingCreationSchema } from "../../lib/validators/item-validator";

export default function CreateListingForm() {
  function handleSubmit() {
    console.log("submitted");
  }
  //   console.log("form");
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
          const handleImageSelectorChange = useCallback(
            (images) => {
              props.setFieldValue("images", images);
            },
            [props.values.images]
          );
          return (
            <Form className="flex flex-col gap-6">
              <MemoizedImageSelector
                name="images"
                label="Upload Photos"
                values={props.values.images}
                max={10}
                infoMessage="You can upload up to 10 photos only."
                onChange={handleImageSelectorChange}
              />
              <InputField type="text" name="itemName" label="Item Name" />
              <Textarea
                label="Exchange For"
                name="exchangeFor"
                // resizable={false}
                placeholder={"What do you want in exchange?"}
              />
              <Button type="submit">Done</Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
