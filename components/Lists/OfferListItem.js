import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import { CircleButton } from "../Buttons";
import { OverflowMenuVertical } from "@carbon/icons-react";
import { BarLoader } from "react-spinners";
import { Button } from "../Buttons";

export default function OfferListItem({
  fromUser = false,
  offer = null,
  isLoading = false,
  isSubmitSuccess = false,
  retryHandler,
}) {
  const itemImages = offer?.images?.map((image, index) => (
    <div
      key={index}
      className="relative aspect-square w-full overflow-hidden rounded-md"
    >
      <Image
        src={image.url || image.content}
        layout="fill"
        objectFit="cover"
        placeholder="blur"
        blurDataURL="/images/placeholder.png"
      />
    </div>
  ));

  async function resubmit() {
    await retryHandler();
  }

  return (
    <li
      className={`relative flex flex-col gap-3 overflow-hidden
     border-gray-100 bg-white md:gap-6 ${
       fromUser
         ? `mb-1 rounded-[10px] border p-4 shadow-lg sm:p-6 ${
             isLoading || !isSubmitSuccess
               ? "before:absolute before:z-10 before:h-full before:w-full before:bg-white/50"
               : ""
           }`
         : "border-b pb-4 md:flex-row"
     }`}
    >
      {fromUser && !isLoading && !isSubmitSuccess ? (
        <div className="absolute top-0 left-0 z-20 flex h-full w-full items-center justify-center bg-white/50 p-4">
          <div className="flex w-full max-w-[200px] flex-col gap-3 drop-shadow-md md:flex-row">
            <Button onClick={resubmit}>Retry</Button>
            <Button underlined={true}>Cancel</Button>
          </div>
        </div>
      ) : null}
      {fromUser && isLoading ? (
        <BarLoader
          color="#85CB33"
          cssOverride={{ width: "100%", position: "absolute", top: 0, left: 0 }}
          // size={14}
          // width={200}
        />
      ) : null}
      <div
        className={`flex items-center gap-4 self-start ${
          fromUser ? "w-full" : "md:items-start"
        }`}
      >
        <div className="relative h-[48px] w-[48px] flex-shrink-0 overflow-hidden rounded-full">
          <Image
            src={
              offer?.user?.image?.url ||
              "https://res.cloudinary.com/dppgyhery/image/upload/v1639759887/idiary/users/1005/xoyowlqk13x4znkcu63p.jpg"
            }
            layout="fill"
            // objectFit="cover"
          />
        </div>
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <p className="min-w-[150px] font-display font-medium md:mt-[0.1rem]">
              {fromUser
                ? "Your Offer"
                : `${offer?.user?.fullName || "User Name"}`}
            </p>
            {!fromUser && (
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
            )}
          </div>
          {fromUser && (
            <CircleButton icon={<OverflowMenuVertical size={24} />} />
          )}
        </div>
      </div>
      <div className="col-span-2 flex flex-col gap-3 md:col-span-1 md:col-start-2">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col">
            <p className="font-display text-xl font-semibold">
              {offer?.name || "Item Name"}
            </p>
            <p className="mt-[0.05rem] text-sm text-gray-300">
              {offer?.region || offer?.location?.region} • 1h ago
            </p>
          </div>
          {!fromUser && (
            <CircleButton icon={<OverflowMenuVertical size={24} />} />
          )}
        </div>
        <p>{offer?.description || "Description"}</p>
        <div className="grid max-w-[calc((0.25rem*2+300px))] grid-cols-[repeat(auto-fill,_minmax(100px,_100px))] gap-1 overflow-hidden">
          {itemImages}
        </div>
      </div>
    </li>
  );
}
