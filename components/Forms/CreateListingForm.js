import { Formik, Form, FormikProvider, useFormik } from "formik";
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
import { create } from "lodash";

const MemoizedImageSelector = memo(ImageSelector);
const MemoizedDropdownSelect = memo(DropdownSelect);

export default function CreateListingForm() {
  ReactModal.setAppElement("#__next");
  const router = useRouter();
  const {
    creationPosition,
    creationRegion,
    listingPosition,
    listingRegion,
    setCreationLocation,
    clearPositionRegion,
    position,
    region,
  } = useMapStore();

  const createListingFormik = useFormik({
    initialValues: {
      images: [],
      name: "",
      exchangeFor: "",
      description: "",
      claimingOptions: [],
      category: "",
      categoryFields: [],
      condition: "",
      draft: false,
      priceValue: 0,
      location: {
        region: creationRegion ? creationRegion : listingRegion,
        lat: creationPosition.lat ? creationPosition.lat : listingPosition.lat,
        lng: creationPosition.lng ? creationPosition.lng : listingPosition.lng,
      },
    },
    validationSchema: listingCreationSchema,
    onSubmit: handleFormSubmit,
  });

  const { path, host } = useUrlCallbackStore();
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
        original: category,
      }))
    : [];

  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  function openLocationModal() {
    setLocationModalOpen(true);
  }

  function closeLocationModal() {
    setLocationModalOpen(false);
    clearPositionRegion();
  }

  async function handleFormSubmit(values) {
    // console.log(values);
    // return;
    try {
      setIsLoading(true);
      const res = await fetch("/api/items", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          categoryFields: values.categoryFields?.length
            ? values.categoryFields.map((field) => ({
                name: field.name,
                value: field.value,
              }))
            : [],
        }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data && data.success) {
        toast.success(!values.draft ? "Item posted" : "Saved in drafts");
        router.push(callbackUrl);
      } else {
        setIsLoading(false);
        toast.error(!values.draft ? "Can't post item" : "Can't save to drafts");
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(!values.draft ? "Can't post item" : "Can't save to drafts");
    }
  }

  useEffect(() => {
    createListingFormik.setFieldValue(
      "categoryFields",
      selectedCategory?.otherFields?.length
        ? selectedCategory?.otherFields?.map((field) => ({
            name: field.name,
            value: "",
            type: field.type,
            selectionItems: field.selectionItems,
          }))
        : []
    );
  }, [selectedCategory]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 py-6 md:mb-6">
      <PopupLoader isOpen={isLoading} message="Uploading item..." />
      <h1 className="text-2xl font-semibold">Make a Barter</h1>

      <FormikProvider value={createListingFormik}>
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
            <Textarea
              infoMessage="Please be reasonable for what item do you want to get"
              label="Exchange For"
              name="exchangeFor"
            />
            <Textarea label="Description" name="description" />
            <MemoizedDropdownSelect
              name="category"
              items={categorySelections}
              placeholder="Select a category"
              label="Category"
              tabIndex={0}
              onChangeGetOriginal={(value) => setSelectedCategory(value)}
            />
            {createListingFormik.values.categoryFields.length
              ? createListingFormik.values.categoryFields.map(
                  (field, index) => {
                    if (field?.type == "text" || field?.type == "number") {
                      return (
                        <InputField
                          label={field?.name}
                          key={index}
                          type={field?.type}
                          name={`categoryFields[${index}].value`}
                        />
                      );
                    } else if (field?.type == "dropdown") {
                      return (
                        <MemoizedDropdownSelect
                          key={index}
                          name={`categoryFields[${index}].value`}
                          items={field?.selectionItems || []}
                          label={field?.name}
                        />
                      );
                    }
                  }
                )
              : null}
            <InputField
              label={"Price Value"}
              type="number"
              name="priceValue"
              min={0}
            />
            {/* <div className="flex w-full flex-col gap-2">
              <p className="font-display font-medium">Price Range Value</p>
              <div className="flex w-full items-center gap-2">
                <InputField
                  type="number"
                  name="priceRangeValue.min"
                  placeholder="Min"
                />
                <p>-</p>
                <InputField
                  type="number"
                  name="priceRangeValue.max"
                  placeholder="Max"
                />
              </div>
            </div> */}
            <RadioSelect
              label="Condition"
              error={
                createListingFormik.errors.condition &&
                createListingFormik.touched.condition
                  ? createListingFormik.errors.condition
                  : null
              }
            >
              <RadioSelectItem
                name="condition"
                value="new"
                checked={createListingFormik.values.condition == "new"}
              >
                New
              </RadioSelectItem>
              <RadioSelectItem
                name="condition"
                value="slightly used"
                checked={
                  createListingFormik.values.condition == "slightly used"
                }
              >
                Slightly used
              </RadioSelectItem>
              <RadioSelectItem
                name="condition"
                value="mostly used"
                checked={createListingFormik.values.condition == "mostly used"}
              >
                Mostly used
              </RadioSelectItem>
              <RadioSelectItem
                name="condition"
                value="old"
                checked={createListingFormik.values.condition == "old"}
              >
                Old
              </RadioSelectItem>
              <RadioSelectItem
                name="condition"
                value="broken"
                checked={createListingFormik.values.condition == "broken"}
              >
                Broken
              </RadioSelectItem>
            </RadioSelect>
          </div>
          <div className="flex flex-col gap-4">
            <LocationModal
              isOpen={locationModalOpen}
              onClose={() => {
                closeLocationModal();
                createListingFormik.setFieldTouched("location", true, true);
              }}
              onApply={() => {
                setCreationLocation();
                createListingFormik.setFieldValue(
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
            <p className="border-b border-gray-100 pb-2 text-sm text-gray-300">
              Location
            </p>
            <div className="flex gap-2 py-2">
              <div className="flex items-center gap-1">
                <Location size={20} />
                <p className="font-medium">
                  {createListingFormik.values.location.region
                    ? createListingFormik.values.location.region
                    : "Choose Location"}
                  {/* {listingRegion && !creationRegion ? listingRegion : ""}
                      {creationRegion ? creationRegion : ""} */}
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
            {createListingFormik.errors.location &&
              createListingFormik.touched.location && (
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
                createListingFormik.errors.claimingOptions &&
                createListingFormik.touched.claimingOptions
                  ? createListingFormik.errors.claimingOptions
                  : null
              }
            >
              <MultiSelectItem
                name="claimingOptions"
                checked={createListingFormik.values.claimingOptions.includes(
                  "meetup"
                )}
                long={true}
                value="meetup"
              >
                <IconDescription
                  icon={<Collaborate size={24} />}
                  label="Meetup"
                  description="
                  After accepting an offer you could ask or decide where do you 
                  want the items to be claimed. Please be reminded to 
                  be careful and prioritize your own safety"
                />
              </MultiSelectItem>
              <MultiSelectItem
                name="claimingOptions"
                checked={createListingFormik.values.claimingOptions.includes(
                  "delivery"
                )}
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
                checked={createListingFormik.values.claimingOptions.includes(
                  "undecided"
                )}
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
            <Button
              onClick={() => {
                createListingFormik.setFieldValue("draft", true);
                createListingFormik.submitForm();
              }}
              secondary={true}
            >
              Save to Drafts
            </Button>
            <Button
              onClick={() => {
                createListingFormik.setFieldValue("draft", false);
                createListingFormik.submitForm();
              }}
            >
              Post
            </Button>
          </div>
        </Form>
      </FormikProvider>
    </div>
  );
}
