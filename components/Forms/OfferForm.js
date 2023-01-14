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
import ReactModal from "react-modal";
import useMapStore from "../../store/useMapStore";
import { useState } from "react";
import useUserOfferStore from "../../store/useUserOfferStore";
import useItemOffersStore from "../../store/useItemOffersStore";
import { toast } from "react-hot-toast";
import useSocketStore from "../../store/useSocketStore";
import { useRouter } from "next/router";
import { stall } from "../../utils/test-utils";

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
  } = useMapStore();
  const { item, setOffer, setIsSubmitting, setIsSubmitSuccess } =
    useUserOfferStore();
  const { setTotalOffers } = useItemOffersStore();
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
    router.push("#offers");
    setOffer(values);
    try {
      setIsSubmitting(true);
      // await stall(5000);
      // setIsSubmitting(false);
      // setIsSubmitSuccess(false);
      // // toast.success("Offer Added");
      // toast.error("Can't add offer");
      // return;
      const res = await fetch(`/api/items/${item}/offers`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (result && result.success) {
        setIsSubmitting(false);
        setIsSubmitSuccess(true);
        socket.emit("offer:create", {
          offer: result.data,
          room: result.data.item,
        });
        // setTotalOffers(result.data.totalOffers);
        toast.success("Offer Added");
      } else {
        console.log("here");
        setIsSubmitting(false);
        setIsSubmitSuccess(false);
        // setOffer(null);
        toast.error("Can't add offer");
      }
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
      setIsSubmitSuccess(false);
      // setOffer(null);
      toast.error("Can't add offer");
    }
    // onClose();
    // setOffer(values);
    // setIsSubmitting(true);
    // await stall(5000);
    // // setIsSubmitSuccess(true);
    // toast.success("Offer Added");
  }
  return (
    <Formik
      initialValues={{
        images: [],
        name: "",
        description: "",
        condition: "",
        location: {
          region: creationRegion ? creationRegion : listingRegion,
          lat: creationPosition.lat
            ? creationPosition.lat
            : listingPosition.lat,
          lng: creationPosition.lng
            ? creationPosition.lng
            : listingPosition.lng,
        },
      }}
      validationSchema={offerSchema}
      onSubmit={(values) => {
        handleFormSubmit(values);
      }}
    >
      {(props) => {
        // this effect is needed to actually change the values for location
        // useEffect(() => {
        //   props.setFieldValue(
        //     "location",
        //     {
        //       region: creationRegion,
        //       lat: creationPosition.lat,
        //       lng: creationPosition.lng,
        //     },
        //     true
        //   );
        // }, [creationRegion]);

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
                <p>Offer</p>
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
