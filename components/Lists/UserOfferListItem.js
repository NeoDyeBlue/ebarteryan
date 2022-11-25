import Image from "next/image";
import { ArrowsHorizontal } from "@carbon/icons-react";
import { StatusBadge } from "../Misc";
import { ItemMiniCard } from "../Cards";

export default function UserOfferListItem({ offer, status }) {
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
    case "failed":
      colors = "bg-danger-500 text-white";
      break;
  }
  return (
    <li
      className="flex h-fit cursor-pointer flex-col gap-3 rounded-[10px] border border-gray-100 bg-white p-3
    hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative h-[36px] w-[36px] overflow-hidden rounded-full">
            <Image
              src={offer?.item?.user?.image?.url}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <p className="overflow-ellipsis whitespace-nowrap font-display font-medium">
            {offer?.item?.user?.firstName} {offer?.item?.user?.lastName}
          </p>
        </div>
        <StatusBadge status={status} statusText={status} />
      </div>
      {/* items */}
      <div className="relative flex flex-col items-center gap-2">
        <ItemMiniCard
          from="Your item"
          itemName={offer?.name}
          image={offer?.image?.url}
        />
        <div
          className={`absolute top-[50%] right-0 z-20 flex h-[36px] w-[36px] translate-y-[-50%] items-center
         justify-center rounded-full ${colors} shadow-lg`}
        >
          <ArrowsHorizontal
            size={24}
            className="flex-shrink-0 rotate-[90deg]"
          />
        </div>
        {/* <p className="text-sm text-gray-200">Exchange for</p> */}
        <ItemMiniCard
          from={`${offer?.item?.user?.firstName}'s item`}
          itemName={offer?.item?.name}
          image={offer?.item?.image?.url}
        />
      </div>
    </li>
  );
}
