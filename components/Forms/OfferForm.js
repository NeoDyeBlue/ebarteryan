import {
  InputField,
  Textarea,
  ImageSelector,
  RadioSelect,
  RadioSelectItem,
} from "../Inputs";
import { Location } from "@carbon/icons-react";
import { Button } from "../Buttons";
import { memo } from "react";
import { Formik, Form } from "formik";
import { offerSchema } from "../../lib/validators/item-validator";
import { LocationModal } from "../Modals";
import useMapStore from "../../store/useMapStore";
import { useState } from "react";
import useUserOfferStore from "../../store/useUserOfferStore";
import { toast } from "react-hot-toast";
import useSocketStore from "../../store/useSocketStore";
import { useRouter } from "next/router";

const MemoizedImageSelector = memo(ImageSelector);

export default function OfferForm({ onClose }) {
  const router = useRouter();
  const {
    creationPosition,
    creationRegion,
    listingPosition,
    listingRegion,
    setCreationLocation,
    clearPositionRegion,
    region,
    position,
  } = useMapStore();
  const {
    item,
    offer,
    setOffer,
    setIsSubmitting,
    setIsSubmitSuccess,
    oldOffer,
    setOfferRetryBody,
    setOldOffer,
    isForUpdating,
    setTempOffer,
  } = useUserOfferStore();
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const { socket } = useSocketStore();
  function openLocationModal() {
    setLocationModalOpen(true);
  }

  function closeLocationModal() {
    setLocationModalOpen(false);
    clearPositionRegion();
  }

  async function handleFormSubmit(values) {
    onClose();
    router.push("#offers-questions");
    setTempOffer(values);
    let formBody;
    try {
      if (isForUpdating) {
        const newImages = values.images.filter(
          (image) => !Object.keys(image).includes("url")
        );
        const toRemoveImages = oldOffer?.images?.filter(
          (image) => !values.images.includes(image)
        );
        const newLocation =
          oldOffer?.location?.coordinates[1] != values?.location?.lat &&
          oldOffer?.location?.coordinates[0] != values?.location?.lng
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
        formBody = newFormBody;
      } else {
        formBody = values;
      }
      setIsSubmitting(true);
      setIsSubmitSuccess(false);
      const res = await fetch(
        isForUpdating
          ? `/api/offers/${oldOffer?._id}`
          : `/api/items/${item}/offers`,
        {
          method: isForUpdating ? "PATCH" : "POST",
          body: JSON.stringify(formBody),
          headers: { "Content-Type": "application/json" },
        }
      );
      const result = await res.json();
      if (result && result.success) {
        setIsSubmitting(false);
        setIsSubmitSuccess(true);
        if (isForUpdating) {
          setOldOffer(null);
        } else {
          socket.emit("offer:create", {
            offer: result.data,
            room: result.data.item,
          });
          socket.emit("offer:count", item);
        }
        setOffer(result.data);
        setTempOffer(null);
        setOfferRetryBody(null);
        toast.success(isForUpdating ? "Offer updated" : "Offer added");
      } else {
        setIsSubmitting(false);
        setIsSubmitSuccess(false);
        setOfferRetryBody(formBody);
        toast.error(isForUpdating ? "Can't update offer" : "Can't add offer");
      }
    } catch (error) {
      setIsSubmitting(false);
      setIsSubmitSuccess(false);
      setOfferRetryBody(formBody);
      toast.error(isForUpdating ? "Can't update offer" : "Can't add offer");
    }
  }

  return (
    <Formik
      initialValues={{
        images: isForUpdating ? offer?.images : [],
        name: isForUpdating ? offer?.name : "",
        description: isForUpdating ? offer?.description : "",
        condition: isForUpdating ? offer?.condition : "",
        location: {
          region: isForUpdating
            ? offer?.region || creationRegion
            : creationRegion || listingRegion,
          lat: isForUpdating
            ? offer?.location?.lat ||
              offer?.location?.coordinates[1] ||
              creationPosition.lat
            : creationPosition.lat || listingPosition.lat,
          lng: isForUpdating
            ? offer?.location?.lng ||
              offer?.location?.coordinates[0] ||
              creationPosition.lng
            : creationPosition.lng || listingPosition.lng,
        },
      }}
      validationSchema={offerSchema}
      onSubmit={(values) => {
        handleFormSubmit(values);
      }}
    >
      {(props) => {
        return (
          <Form>
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
              <Textarea label="Description" name="description" />
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
              <div className="flex flex-col gap-4">
                <LocationModal
                  isOpen={locationModalOpen}
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
                <p className="border-b border-gray-100 pb-2 text-sm text-gray-300">
                  Location
                </p>
                <div className="flex flex-col gap-1 py-2">
                  <div className="flex gap-2">
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
              </div>
              <Button type="submit">
                <p>{isForUpdating ? "Save" : "Offer"}</p>
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
