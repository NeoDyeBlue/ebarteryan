import { Textarea } from "../Inputs";
import { Button } from "../Buttons";
import { Form, FormikProvider, useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Rating } from "react-simple-star-rating";
import useReviewStore from "../../store/useReviewStore";
import { PopupLoader } from "../Loaders";
import useSocketStore from "../../store/useSocketStore";

export default function ReviewForm({ onClose, onReview }) {
  const { reviewee, item } = useReviewStore();
  const { socket } = useSocketStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  async function handleReviewSubmit(values) {
    try {
      values.user = reviewee;
      values.item = item;
      setIsSubmitting(true);
      const res = await fetch(`/api/reviews`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (result && result.success) {
        setIsSubmitting(false);
        toast.success("Review submitted!");
        socket.emit("review:create", result.data);
        onReview();
        onClose();
      } else {
        setIsSubmitting(false);
        // setOffer(null);
        toast.error("Can't submit review");
      }
    } catch (error) {
      setIsSubmitSuccess(false);
      toast.error("Can't submit review");
    }
  }

  const reviewFormik = useFormik({
    initialValues: {
      rate: 1,
      review: "",
    },
    // validationSchema: questionSchema,
    onSubmit: handleReviewSubmit,
  });

  function scale(number, inMin, inMax, outMin, outMax) {
    return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  function check(index) {
    reviewFormik.setFieldValue("rate", scale(index, 0, 100, 0, 5));
    // console.log(scale(index, 0, 100, 0, 5));
  }
  return (
    <FormikProvider value={reviewFormik}>
      <PopupLoader isOpen={isSubmitting} message="Submitting review" />
      <Form className="flex flex-col gap-4">
        <p>Rate your experience with the barterer</p>
        <div className="mx-auto">
          <Rating
            className="flex flex-col align-middle"
            style={{
              display: "block",
            }}
            onClick={check}
            transition
            // allowHalfIcon
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
              // "Terrible+",
              "Bad",
              // "Bad+",
              "Average",
              // "Average+",
              "Great",
              // "Great+",
              "Awesome",
              // "Awesome+",
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
