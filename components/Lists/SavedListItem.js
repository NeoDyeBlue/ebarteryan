import { TrashCan, Warning } from "@carbon/icons-react";
import Image from "next/image";
import Link from "next/link";
import { CircleButton } from "../Buttons";

export default function SavedListItem({
  image,
  name,
  exchangeFor,
  onDelete,
  to,
  isRemoved = false,
}) {
  return (
    <li
      className={`flex min-h-[145px] gap-2 rounded-[10px] p-3 hover:bg-gray-100/30 md:min-h-[175px] md:items-center ${
        isRemoved ? "border border-gray-100" : ""
      }`}
    >
      {!isRemoved ? (
        <Link href={to}>
          <a className="flex w-full gap-2 md:gap-4">
            <div className="relative aspect-square w-full max-w-[120px] flex-shrink-0 overflow-hidden rounded-[10px] md:max-w-[150px]">
              <Image
                src={image}
                layout="fill"
                objectFit="cover"
                alt="item image"
              />
            </div>
            <div className="flex w-full flex-col gap-1 overflow-hidden text-gray-400">
              <p className="text-ellipsis whitespace-nowrap font-display font-semibold text-black-light">
                {name}
              </p>
              <p className="text-[15px] font-medium">Exchange for:</p>
              <p className="overflow-hidden overflow-ellipsis whitespace-nowrap text-[15px]">
                {exchangeFor}
              </p>
            </div>
          </a>
        </Link>
      ) : (
        <div className="flex w-full items-center gap-2">
          <Warning size={48} className="text-gray-200" />
          <p className="w-full text-gray-200">
            This item was unavailable or removed
          </p>
        </div>
      )}
      <div className="self-start">
        <CircleButton onClick={onDelete} icon={<TrashCan size={24} />} />
      </div>
    </li>
  );
}
