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
import { useState, useMemo, useEffect, memo } from "react";
import dynamic from "next/dynamic";
const DropdownSelect = dynamic(() => import("../Inputs/DropdownSelect"), {
  ssr: false,
});
import { listingCreationSchema } from "../../lib/validators/item-validator";
import useSWR from "swr";
// import { toast } from "react-toastify";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import useUrlCallbackStore from "../../store/useUrlCallbackStore";
import { PopupLoader } from "../Loaders";

const MemoizedImageSelector = memo(ImageSelector);
const MemoizedDropdownSelect = memo(DropdownSelect);

export default function EditListingForm({ item }) {
  ReactModal.setAppElement("#__next");
  const router = useRouter();
  const {
    creationPosition,
    creationRegion,
    setCreationLocation,
    clearPositionRegion,
    region,
    position,
  } = useMapStore();

  const { path, host } = useUrlCallbackStore();
  //   const { item } = useUserItemStore();
  const callbackUrl = useMemo(() => {
    if (
      window &&
      host == `${window.location.protocol}//${window.location.host}` &&
      path !== "/create"
    ) {
      return path;
    }
    return "/";
  }, [path, host]);

  const { data: categories, error } = useSWR("/api/categories");
  const categorySelections = categories?.success
    ? categories.data.map((category) => ({
        name: category.name,
        value: category._id,
      }))
    : [];

  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function openLocationModal() {
    setLocationModalOpen(true);
  }

  function closeLocationModal() {
    setLocationModalOpen(false);
    clearPositionRegion();
  }

  async function handleFormSubmit(values) {
    // console.log(values);
    const newImages = values.images.filter(
      (image) => !Object.keys(image).includes("url")
    );
    const toRemoveImages = item?.images?.filter(
      (image) => !values.images.includes(image)
    );
    const newLocation =
      item?.location?.coordinates[1] != values?.location?.lat &&
      item?.location?.coordinates[0] != values?.location?.lng
        ? {
            region: values.location.region,
            location: {
              type: "Point",
              coordinates: [values.location.lng, values.location.lat],
            },
          }
        : null;

    let { location, images, ...newFormBody } = values;
    if (newLocation) {
      newFormBody = { ...newLocation, ...newFormBody };
    }
    newFormBody.newImages = newImages;
    newFormBody.toRemoveImages = toRemoveImages;

    try {
      setIsLoading(true);
      const res = await fetch(`/api/items/${item?._id}`, {
        method: "PATCH",
        body: JSON.stringify(newFormBody),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data && data.success) {
        toast.success("Item Updated");
        setIsLoading(false);
        // router.push(`/items/${item?._id}`);
      } else {
        setIsLoading(false);
        toast.error("Can't update item");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Can't update item");
    }
  }

  useEffect(() => {
    setCreationLocation({
      region: item?.region,
      position: {
        lng: item?.location?.coordinates[0],
        lat: item?.location?.coordinates[1],
      },
    });
  }, [item?.region, item?.location?.coordinates, setCreationLocation]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 py-6 md:mb-6">
      <PopupLoader isOpen={isLoading} message="Updating item..." />
      <h1 className="text-2xl font-semibold">Edit Item</h1>
      <Formik
        initialValues={{
          images: item?.images?.length ? [...item?.images] : [],
          name: item?.name,
          exchangeFor: item?.exchangeFor,
          description: item?.description,
          claimingOptions: item?.claimingOptions?.length
            ? [...item?.claimingOptions]
            : [],
          category: item?.category?._id,
          condition: item?.condition,
          location: {
            region: creationRegion ? creationRegion : item?.region,
            lat: creationPosition?.lat
              ? creationPosition.lat
              : item?.location?.coordinates[1],
            lng: creationPosition?.lng
              ? creationPosition.lng
              : item?.location?.coordinates[0],
          },
        }}
        validationSchema={listingCreationSchema}
        onSubmit={handleFormSubmit}
      >
        {(props) => {
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
                <InputField type="text" name="name" label="Item Name" />
                <Textarea label="Exchange For" name="exchangeFor" />
                <Textarea label="Description" name="description" />
                <MemoizedDropdownSelect
                  name="category"
                  items={categorySelections}
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
                    value="slightly used"
                    checked={props.values.condition == "slightly used"}
                  >
                    Slightly used
                  </RadioSelectItem>
                  <RadioSelectItem
                    name="condition"
                    value="mostly used"
                    checked={props.values.condition == "mostly used"}
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
                        closeLocationModal();
                        props.setFieldTouched("location", true, true);
                      }}
                      onApply={() => {
                        setCreationLocation();
                        props.setFieldValue(
                          "location",
                          {
                            region: region,
                            lat: position.lat,
                            lng: position.lng,
                          },
                          true
                        );
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
                      {/* {!props.values.location.region
                        ? "Choose Location"
                        : props.values.location.region} */}
                      {creationRegion ? creationRegion : "Choose Location"}
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
              <div className="flex items-center gap-4">
                <Button type="submit">Done</Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
