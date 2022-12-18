import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import { CircleButton } from "../Buttons";
import {
  OverflowMenuVertical,
  Add,
  Chat,
  Checkmark,
} from "@carbon/icons-react";
import { ConditionBadge } from "../Misc";
import { useState, useCallback } from "react";
import ImageViewer from "react-simple-image-viewer";
import format from "date-fns/format";
import { Button } from "../Buttons";
import { toast } from "react-hot-toast";
import { PopupLoader } from "../Loaders";
import { ConfirmationModal } from "../Modals";

export default function OfferListItem({
  offer,
  withButtons,
  onAccept,
  withoutBorder,
}) {
  //states
  const [currentImage, setCurrentImage] = useState(0);
  const [acceptConfirmationOpen, setAcceptConfirmationOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //elements
  const itemImages = offer?.images?.map((image, index) => (
    <div
      key={index}
      onClick={() => openImageViewer(index)}
      className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-md"
    >
      <Image
        src={image.url || image.content}
        layout="fill"
        objectFit="cover"
        placeholder="blur"
        blurDataURL="/images/placeholder.png"
        alt="selected image"
      />
    </div>
  ));

  //callbacks
  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  //functions
  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  function showConfirmation() {
    setAcceptConfirmationOpen(true);
    // setIsLoading(true);
    // await stall(3000);
    // setIsLoading(false);
    // toast.success("Offer accepted");
  }

  async function handleAcceptConfirm() {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/items/${offer.item}/offers/${offer._id}`, {
        method: "PATCH",
        body: JSON.stringify({ accepted: true }),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (result && result.success) {
        onAccept(true, offer);
        setIsLoading(false);
        toast.success("Offer accepted");
      } else if (!result.success) {
        setIsLoading(false);
        toast.error(result.errorMessage);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Can't accept offer");
    }
  }

  return (
    <li
      className={`relative flex flex-col gap-3 overflow-hidden
     ${withoutBorder ? "" : "border-b border-gray-100"} bg-white pb-4 md:gap-6
     `}
    >
      <PopupLoader message="Accepting Offer" isOpen={isLoading} />
      <ConfirmationModal
        isOpen={acceptConfirmationOpen}
        label="Accept Offer?"
        onClose={() => setAcceptConfirmationOpen(false)}
        onConfirm={handleAcceptConfirm}
        message="Once the offer was accepted your item will not accept any more offers"
      />
      {isViewerOpen && (
        <ImageViewer
          backgroundStyle={{
            zIndex: 100,
            backgroundColor: "rgba(0,0,0,0.75)",
            padding: "1.5rem",
          }}
          closeComponent={<Add className="rotate-[135deg]" size={48} />}
          src={offer?.images.map((image) => image.url)}
          currentIndex={currentImage}
          disableScroll={true}
          closeOnClickOutside={true}
          onClose={closeImageViewer}
        />
      )}
      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <p className="font-display font-medium">{offer?.name}</p>
            <p className="mt-[0.05rem] flex flex-col gap-2 text-sm text-gray-300 sm:flex-row">
              <span>
                {offer?.region || offer?.location?.region} •{" "}
                {offer?.createdAt && format(new Date(offer?.createdAt), "PP")}{" "}
              </span>
              <ConditionBadge condition={offer?.condition} />
            </p>
          </div>
          <CircleButton icon={<OverflowMenuVertical size={24} />} />
        </div>
        <p>{offer?.description || "Description"}</p>
        <div className="grid max-w-[calc((0.25rem*2+300px))] grid-cols-[repeat(auto-fill,_minmax(100px,_100px))] gap-1 overflow-hidden">
          {itemImages}
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-2 self-start md:flex-row md:items-center">
        <div className="flex w-full items-center gap-4">
          <div className="relative h-[48px] w-[48px] flex-shrink-0 overflow-hidden rounded-full">
            <Image
              src={offer?.user?.image?.url}
              layout="fill"
              alt="user image"
              // objectFit="cover"
            />
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col">
              <p className="min-w-[150px] font-display text-sm md:mt-[0.1rem]">
                {offer?.user?.fullName}
              </p>
              <div className="flex gap-1">
                <span className="-ml-[2px] flex w-full items-center justify-start gap-1">
                  <Rating
                    className="align-middle"
                    transition
                    allowHalfIcon
                    fillColor="#85CB33"
                    emptyColor="#D2D2D2"
                    initialValue={4.5}
                    readonly
                    size={18}
                  />
                  <span className="mt-[0.2rem] text-xs">• 10</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        {withButtons && (
          <div className="flex w-full justify-end gap-2">
            <Button underlined autoWidth small>
              <Chat size={20} />
              <p className="hidden lg:block">Ask about the offer</p>
            </Button>
            {!offer.accepted && (
              <Button
                autoWidth
                small
                onClick={showConfirmation}
                disabled={isLoading}
              >
                <Checkmark size={20} />
                <p>Accept</p>
              </Button>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
