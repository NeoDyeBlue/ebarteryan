import { Formik, Form } from "formik";
import {
  InputField,
  ImageSelector,
  Textarea,
  RadioSelect,
  RadioSelectItem,
  MultiSelect,
  MultiSelectItem,
} from "../Inputs";
import { IconDescription } from "../Icons";
import { LocationModal } from "../Modals";
import { Collaborate, Delivery, Chat, Location } from "@carbon/icons-react";
import { Button } from "../Buttons";
import ReactModal from "react-modal";
import useMapStore from "../../store/useMapStore";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const DropdownSelect = dynamic(() => import("../Inputs/DropdownSelect"), {
  ssr: false,
});
import { memo } from "react";
import { listingCreationSchema } from "../../lib/validators/item-validator";

const MemoizedImageSelector = memo(ImageSelector);
const MemoizedDropdownSelect = memo(DropdownSelect);

export default function CreateListingForm() {
  const {
    creationPosition,
    creationRegion,
    listingPosition,
    listingRegion,
    setCreationLocation,
    clearPositionRegion,
  } = useMapStore();

  const [locationModalOpen, setLocationModalOpen] = useState(false);

  function openLocationModal() {
    setLocationModalOpen(true);
  }

  function closeLocationModal() {
    setLocationModalOpen(false);
    clearPositionRegion();
  }

  function handleFormSubmit(values) {
    // event.preventDefault();
    console.log("submit", values);
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
          claimingOptions: [],
          category: "",
          condition: "",
          location: {
            region: listingRegion,
            lat: listingPosition.lat,
            lng: listingPosition.lng,
          },
        }}
        validationSchema={listingCreationSchema}
        onSubmit={(values) => {
          handleFormSubmit(values);
        }}
      >
        {(props) => {
          // this effect is needed to actually change the values for location
          useEffect(() => {
            props.setFieldValue(
              "location",
              {
                region: creationRegion,
                lat: creationPosition.lat,
                lng: creationPosition.lng,
              },
              true
            );
          }, [creationRegion]);

          return (
            <Form className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <p className="border-b border-gray-100 pb-2 text-sm text-gray-300">
                  Details
                </p>
                <MemoizedImageSelector
                  name="images"
                  label="Upload Photos"
                  max={10}
                  infoMessage="You can upload up to 10 photos only."
                />
                <InputField type="text" name="itemName" label="Item Name" />
                <Textarea label="Exchange For" name="exchangeFor" />
                <Textarea label="Description" name="description" />
                <MemoizedDropdownSelect
                  name="category"
                  items={["1", "2", "3"]}
                  placeholder="Select a category"
                  label="Category"
                  tabIndex={0}
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
              <div className="flex flex-col gap-4">
                <ReactModal
                  contentLabel="Location Modal"
                  isOpen={locationModalOpen}
                  // closeTimeoutMS={300}
                  overlayClassName={`bg-black/20 fixed top-0 z-50 flex h-full w-full items-end`}
                  preventScroll={true}
                  onRequestClose={() => {
                    closeLocationModal();
                    props.setFieldTouched("location", true, true);
                  }}
                  bodyOpenClassName="modal-open-body"
                  className={`relative h-[90vh] w-full overflow-hidden rounded-t-[10px] bg-white
         py-6 shadow-lg md:m-auto md:max-w-[580px] md:rounded-[10px]`}
                >
                  <div
                    className={`custom-scrollbar container flex max-h-full min-h-full overflow-y-auto md:px-6`}
                  >
                    <LocationModal
                      onClose={() => {
                        console.log("closed");
                        closeLocationModal();
                        props.setFieldTouched("location", true, true);
                      }}
                      onApply={() => {
                        setCreationLocation();
                        closeLocationModal();
                        // handleLocationChange();
                      }}
                    />
                  </div>
                </ReactModal>
                <p className="border-b border-gray-100 pb-2 text-sm text-gray-300">
                  Location
                </p>
                <div className="flex gap-2 py-2">
                  <div className="flex items-center gap-1">
                    <Location size={20} />
                    <p className="font-medium">
                      {!listingRegion && !creationRegion
                        ? "Choose Location"
                        : ""}
                      {listingRegion && !creationRegion ? listingRegion : ""}
                      {creationRegion ? creationRegion : ""}
                    </p>
                  </div>
                  <span>|</span>
                  <button
                    onClick={() => {
                      openLocationModal();
                    }}
                    type="button"
                    className="font-display font-medium text-green-500 hover:underline"
                  >
                    Change
                  </button>
                </div>
                {props.errors.location && props.touched.location && (
                  <p className="flex gap-1 text-sm text-danger-500">
                    Please set your location correctly
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <p className="border-b border-gray-100 pb-2 text-sm text-gray-300">
                  Claiming options
                </p>
                <MultiSelect
                  label="How do you want the item to be claimed?"
                  infoMessage="You can select more than one"
                  error={
                    props.errors.claimingOptions &&
                    props.touched.claimingOptions
                      ? props.errors.claimingOptions
                      : null
                  }
                >
                  <MultiSelectItem
                    name="claimingOptions"
                    checked={props.values.claimingOptions.includes("meetup")}
                    long={true}
                    value="meetup"
                  >
                    <IconDescription
                      icon={<Collaborate size={24} />}
                      label="Meetup"
                      description="
                  After accepting an offer you could ask or decide where do you 
                  want the items to be claimed."
                    />
                  </MultiSelectItem>
                  <MultiSelectItem
                    name="claimingOptions"
                    checked={props.values.claimingOptions.includes("delivery")}
                    long={true}
                    value="delivery"
                  >
                    <IconDescription
                      icon={<Delivery size={24} />}
                      label="Delivery"
                      description="
                  Delivery is set up by you after accepting an offer."
                    />
                  </MultiSelectItem>
                  <MultiSelectItem
                    name="claimingOptions"
                    checked={props.values.claimingOptions.includes("undecided")}
                    long={true}
                    value="undecided"
                  >
                    <IconDescription
                      icon={<Chat size={24} />}
                      label="To be decided"
                      description="
                  After accepting an offer, both of you would chat about how the 
                  items will be claimed.
                  "
                    />
                  </MultiSelectItem>
                </MultiSelect>
              </div>
              <Button type="submit">Done</Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
