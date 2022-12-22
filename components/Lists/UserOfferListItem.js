import Image from "next/image";
// import { ArrowsHorizontal } from "@carbon/icons-react";
import { StatusBadge } from "../Misc";
import { ItemMiniCard } from "../Cards";
import { Checkmark, TrashCan } from "@carbon/icons-react";
// import { CircleButton } from "../Buttons";
import { useRouter } from "next/router";
import { KebabMenu, KebabMenuItem } from "../Navigation";
import { useState } from "react";
import { ReviewModal } from "../Modals";
import useReviewStore from "../../store/useReviewStore";

export default function UserOfferListItem({ offer, status }) {
  const { setReviewee, setItem, isReviewDone } = useReviewStore();
  const router = useRouter();
  let colors = "";
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
    case "received" || isReviewDone:
      colors = "bg-info-500 text-white";
      break;
    case "failed":
      colors = "bg-danger-500 text-white";
      break;
  }

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  function showReviewModal() {
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
      onClick={() => router.push(`/items/${offer?.item?._id}`)}
    >
      <div onClick={(e) => e.stopPropagation()} className="absolute">
        <ReviewModal isOpen={isReviewModalOpen} onClose={hideReviewModal} />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex w-full items-center gap-2 overflow-hidden">
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
          <StatusBadge status={status} statusText={status} />
        </div>
        <KebabMenu>
          {offer?.accepted && !offer?.received && (
            <KebabMenuItem onClick={showReviewModal}>
              <Checkmark size={24} /> Set as Received
            </KebabMenuItem>
          )}
          <KebabMenuItem>
            <TrashCan size={24} /> Delete Offer
          </KebabMenuItem>
        </KebabMenu>
        {/* <CircleButton
          icon={<OverflowMenuVertical size={24} />}
          onClick={menuClickHandler}
        /> */}
      </div>
      {/* items */}
      <div className="relative flex flex-col items-center gap-2">
        <ItemMiniCard
          from="Your item"
          itemName={offer?.name}
          image={offer?.image?.url}
          createdAt={offer?.createdAt}
        />
        {/* <div
          className={`absolute top-[50%] right-0 z-20 flex h-[36px] w-[36px] translate-y-[-50%] items-center
         justify-center rounded-full ${colors} shadow-lg`}
        >
          <ArrowsHorizontal
            size={24}
            className="flex-shrink-0 rotate-[90deg]"
          />
        </div> */}
        {/* <p className="text-sm text-gray-200">Exchange for</p> */}
        <ItemMiniCard
          from={`${offer?.item?.user?.firstName}'s item`}
          itemName={offer?.item?.name}
          image={offer?.item?.image?.url}
          createdAt={offer?.item?.createdAt}
        />
      </div>
    </li>
  );
}
