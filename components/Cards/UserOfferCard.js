import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import { CircleButton } from "../Buttons";
import {
  OverflowMenuVertical,
  StarFilled,
  Add,
  Chat,
  Edit,
  TrashCan,
} from "@carbon/icons-react";
import { BarLoader } from "react-spinners";
import { Button } from "../Buttons";
import { ConditionBadge } from "../Misc";
import { useSession } from "next-auth/react";
import { useState, useCallback } from "react";
import ImageViewer from "react-simple-image-viewer";
import format from "date-fns/format";
import useUserOfferStore from "../../store/useUserOfferStore";
import { KebabMenu, KebabMenuItem } from "../Navigation";

export default function UserOfferCard({
  offer,
  isLoading = false,
  isSubmitSuccess = false,
  retryHandler,
  itemLister,
  isAccepted = false,
}) {
  const { data: session, status } = useSession();
  const { setOffer } = useUserOfferStore();
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
        alt="item image"
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

  async function resubmit() {
    await retryHandler();
  }

  return (
    <li
      className={`relative mb-1 flex flex-col gap-3
     md:gap-6 ${
       isLoading || !isSubmitSuccess
         ? "before:absolute before:z-10 before:h-full before:w-full before:bg-white/50"
         : ""
     }`}
    >
      {isLoading ? (
        <BarLoader
          color="#85CB33"
          cssOverride={{
            width: "100%",
            marginBottom: "0.25rem",
            display: "block",
          }}
          // size={14}
          // width={200}
        />
      ) : null}
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
      {!isLoading && !isSubmitSuccess ? (
        <div className="absolute top-0 left-0 z-20 flex h-full w-full items-center justify-center bg-white/50 p-4">
          <div className="flex w-full max-w-[200px] flex-col gap-3 drop-shadow-md md:flex-row">
            <Button onClick={resubmit}>Retry</Button>
            <Button underlined={true} onClick={() => setOffer(null)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
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
          {/* <CircleButton icon={<OverflowMenuVertical size={24} />} /> */}
          <KebabMenu>
            <KebabMenuItem>
              <Edit size={24} /> Edit Offer
            </KebabMenuItem>
            <KebabMenuItem>
              <TrashCan size={24} /> Delete Offer
            </KebabMenuItem>
          </KebabMenu>
        </div>
        <p>{offer?.description || "Description"}</p>
        <div className="grid max-w-[calc((0.25rem*2+300px))] grid-cols-[repeat(auto-fill,_minmax(100px,_100px))] gap-1 overflow-hidden">
          {itemImages}
        </div>
      </div>
      {/* <div className={`flex w-full items-center gap-4 self-start`}>
        <div className="relative h-[48px] w-[48px] flex-shrink-0 overflow-hidden rounded-full">
          <Image
            src={
              offer?.user?.image?.url ||
              "https://res.cloudinary.com/dppgyhery/image/upload/v1639759887/idiary/users/1005/xoyowlqk13x4znkcu63p.jpg"
            }
            layout="fill"
            // objectFit="cover"
            alt="user image"
          />
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <p className="min-w-[150px] font-display text-sm md:mt-[0.1rem]">
              {session?.user && status == "authenticated"
                ? `${session.user.firstName} ${session.user.lastName}`
                : ""}
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
      </div> */}
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
              <p className="min-w-[150px] font-display">
                {offer?.user?.fullName}
              </p>
              <div className="flex gap-1">
                <span className="flex w-full items-center justify-start gap-1">
                  {/* <Rating
                    className="align-middle"
                    transition
                    allowHalfIcon
                    fillColor="#100B00"
                    emptyColor="#D2D2D2"
                    initialValue={4.5}
                    readonly
                    size={18}
                  /> */}
                  {/* <span className="mt-[0.2rem] text-xs">• 10</span> */}
                  <StarFilled size={18} />
                  <span>5</span>
                  <span className="text-gray-200">{"(10)"}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        {isAccepted && (
          <div className="flex w-full justify-end gap-2">
            <Button underlined autoWidth small>
              <div className="relative mr-1 h-[20px] w-[20px] overflow-hidden rounded-full">
                <Image
                  src={itemLister?.image?.url}
                  alt="item lister image"
                  layout="fill"
                />
              </div>
              <Chat size={20} />
              <p className="hidden lg:block">Chat {itemLister?.firstName}</p>
            </Button>
          </div>
        )}
      </div>
    </li>
  );
}
