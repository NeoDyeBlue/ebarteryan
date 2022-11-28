import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import { CircleButton } from "../Buttons";
import { OverflowMenuVertical, Add } from "@carbon/icons-react";
import { ConditionBadge } from "../Misc";
import { useState, useCallback } from "react";
import ImageViewer from "react-simple-image-viewer";
import format from "date-fns/format";

export default function OfferListItem({ offer }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
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

  const openImageViewer = useCallback((index) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  return (
    <li
      className={`relative flex flex-col-reverse gap-3 overflow-hidden
     border-b border-gray-100 bg-white pb-4 md:gap-6
     `}
    >
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
      <div className={`flex w-full items-center gap-4 self-start`}>
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
      <div className="flex w-full flex-col gap-3">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <p className="font-display font-medium">
              {offer?.name || "Item Name"}
            </p>
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
    </li>
  );
}
