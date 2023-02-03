import Image from "next/image";
// import { ArrowsHorizontal } from "@carbon/icons-react";
import { StatusBadge } from "../Misc";
import { ItemMiniCard } from "../Cards";
import { Checkmark, TrashCan } from "@carbon/icons-react";
import { Button } from "../Buttons";
import { useRouter } from "next/router";
import { KebabMenu, KebabMenuItem } from "../Navigation";
import { useState } from "react";
import { ReviewModal } from "../Modals";
import useReviewStore from "../../store/useReviewStore";
import { PopupLoader } from "../Loaders";
import { ConfirmationModal } from "../Modals";
import { toast } from "react-hot-toast";

export default function UserOfferListItem({ offer, mutate }) {
  const { setReviewee, setItem, isReviewDone } = useReviewStore();
  const router = useRouter();
  let colors = "";
  let status;
  if (offer.accepted && !offer.reviewed) {
    status = "accepted";
  } else if (offer.accepted && offer.reviewed) {
    status = "reviewed";
  } else if (!offer?.item?.ended && offer?.item?.available) {
    status = "waiting";
  } else if (!offer?.item || offer?.item?.ended || !offer?.item?.available) {
    status = "failed";
  }

  switch (status) {
    case "info":
      colors = "bg-info-500 text-white";
      break;
    case "waiting":
      colors = "bg-warning-500 text-black-light";
      break;
    case "accepted":
      colors = "bg-success-500 text-white";
      break;
    case "reviewed" || isReviewDone:
      colors = "bg-info-500 text-white";
      break;
    case "failed":
      colors = "bg-danger-500 text-white";
      break;
  }

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);

  async function handleDeletelick() {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/offers/${offer?._id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result && result.success) {
        toast.success("Offer deleted");
        mutate();
      } else {
        toast.error("Can't delete offer");
      }
      setIsDeleting(false);
    } catch (error) {
      toast.error("Can't delete offer");
      setIsDeleting(false);
    }
  }

  function showDeleteConfirmation(event) {
    event.stopPropagation();
    setIsDeleteConfirmationOpen(true);
  }

  function hideDeleteConfirmationOpen() {
    setIsDeleteConfirmationOpen(false);
  }

  function showReviewModal(event) {
    event.stopPropagation();
    setReviewee(offer?.item?.user?._id);
    setItem(offer?.item?._id);
    setIsReviewModalOpen(true);
  }

  function hideReviewModal() {
    setIsReviewModalOpen(false);
  }

  return (
    <li
      className="relative flex h-fit cursor-pointer flex-col gap-3 rounded-[10px] border border-gray-100 bg-white
    p-3 hover:shadow-md"
      onClick={() => offer?.item && router.push(`/items/${offer?.item?._id}`)}
    >
      <div onClick={(e) => e.stopPropagation()} className="absolute">
        <ReviewModal
          onReview={mutate}
          isOpen={isReviewModalOpen}
          onClose={hideReviewModal}
        />
        <PopupLoader message="Deleting offer..." isOpen={isDeleting} />
        <ConfirmationModal
          onClose={hideDeleteConfirmationOpen}
          isOpen={isDeleteConfirmationOpen}
          label="Delete Offer"
          message="Deleting your offer will be gone forever!"
          onConfirm={handleDeletelick}
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex w-full items-center gap-2 overflow-hidden">
          {offer?.item && (
            <>
              <div className="relative h-[36px] w-[36px] flex-shrink-0 overflow-hidden rounded-full">
                <Image
                  src={offer?.item?.user?.image?.url}
                  layout="fill"
                  objectFit="cover"
                  alt="user image"
                />
              </div>
              <p className="overflow-hidden overflow-ellipsis whitespace-nowrap font-display text-sm font-medium">
                {offer?.item?.user?.firstName} {offer?.item?.user?.lastName}
              </p>
            </>
          )}
          <StatusBadge status={status} statusText={status} />
        </div>
        {/* <KebabMenu>
          {offer?.accepted && !offer?.reviewed && (
            <KebabMenuItem onClick={showReviewModal}>
              <Checkmark size={24} /> Add a Review
            </KebabMenuItem>
          )}
          <KebabMenuItem onClick={showDeleteConfirmation}>
            <TrashCan size={24} /> Delete Offer
          </KebabMenuItem>
        </KebabMenu> */}
      </div>
      {/* items */}
      <div className="relative flex flex-col items-center gap-2">
        <ItemMiniCard
          from="Your item"
          itemName={offer?.name}
          image={offer?.image?.url}
          createdAt={offer?.createdAt}
        />
        {offer?.item ? (
          <ItemMiniCard
            from={`${offer?.item?.user?.firstName}'s item`}
            itemName={offer?.item?.name}
            image={offer?.item?.image?.url}
            createdAt={offer?.item?.createdAt}
          />
        ) : (
          <ItemMiniCard isNull />
        )}
        <div className="h-[37.5px] self-end">
          {status == "accepted" && (
            <Button small autoWidth onClick={showReviewModal}>
              Review
            </Button>
          )}
          {status !== "accepted" && status !== "reviewed" && (
            <Button small autoWidth secondary onClick={showDeleteConfirmation}>
              Delete
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}
