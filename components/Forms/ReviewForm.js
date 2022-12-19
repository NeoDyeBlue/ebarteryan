import { Textarea } from "../Inputs";
import { Button } from "../Buttons";
import { Form, FormikProvider, useFormik } from "formik";
import { useState } from "react";
import useUserOfferStore from "../../store/useUserOfferStore";
import useItemOffersStore from "../../store/useItemOffersStore";
import { toast } from "react-hot-toast";
import { stall } from "../../utils/test-utils";
import { Rating } from "react-simple-star-rating";

export default function ReviewForm({ onClose }) {
  const { item, setOffer, setIsSubmitting, setIsSubmitSuccess } =
    useUserOfferStore();
  const { setTotalOffers } = useItemOffersStore();

  async function handleReviewSubmit(values) {
    onClose();
    try {
      //   setIsSubmitting(true);
      //   await stall(5000);
      //   setIsSubmitting(false);
      //   setIsSubmitSuccess(false);
      //   // toast.success("Offer Added");
      //   toast.error("Can't add offer");
      console.log(values);
      return;
      const res = await fetch(`/api/offers/${item}`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (result && result.success) {
        setIsSubmitting(false);
        setIsSubmitSuccess(true);
        socket.emit("offer", {
          offer: result,
          room: result.data.docs[0].item,
        });
        setTotalOffers(result.data.totalDocs);
        toast.success("Offer Added");
      } else {
        setIsSubmitting(false);
        setIsSubmitSuccess(false);
        // setOffer(null);
        toast.error("Can't add offer");
      }
    } catch (error) {
      //   setIsSubmitting(false);
      //   setIsSubmitSuccess(false);
      //   // setOffer(null);
      toast.error("Can't add offer");
    }
  }

  const reviewFormik = useFormik({
    initialValues: {
      rating: 0.5,
      review: "",
    },
    // validationSchema: questionSchema,
    onSubmit: handleReviewSubmit,
  });

  function scale(number, inMin, inMax, outMin, outMax) {
    return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  function check(index) {
    reviewFormik.setFieldValue("rating", scale(index, 0, 100, 0, 5));
    // console.log(scale(index, 0, 100, 0, 5));
  }
  return (
    <FormikProvider value={reviewFormik}>
      <Form className="flex flex-col gap-4">
        <p>
          Rate your experience with the barterer before setting the item as
          received.
        </p>
        <div className="mx-auto">
          <Rating
            className="flex flex-col align-middle"
            style={{
              display: "block",
            }}
            onClick={check}
            transition
            allowHalfIcon
            fillColor="#85CB33"
            emptyColor="#D2D2D2"
            initialValue={reviewFormik.values.rating}
            showTooltip
            tooltipStyle={{
              margin: "0.5rem auto 0 auto",
              display: "block",
              width: "auto",
              textAlign: "center",
              backgroundColor: "transparent",
              color: "black",
              fontWeight: "600",
            }}
            tooltipArray={[
              "Terrible",
              "Terrible+",
              "Bad",
              "Bad+",
              "Average",
              "Average+",
              "Great",
              "Great+",
              "Awesome",
              "Awesome+",
            ]}
            // readonly
            size={48}
          />
        </div>
        <Textarea
          placeholder="Your review...(optional)"
          name="review"
          value={reviewFormik.values.review}
        />
        <Button type="submit">
          <p>Submit Review</p>
        </Button>
      </Form>
    </FormikProvider>
  );
}
