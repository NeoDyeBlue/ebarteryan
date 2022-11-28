import { Timer, Need, TrashCan } from "@carbon/icons-react";
import Image from "next/image";
import Link from "next/link";
import { CircleButton, Button } from "../Buttons";

export default function SavedListItem({
  image,
  name,
  description,
  time,
  offers,
  to,
}) {
  return (
    <li className="flex flex-col gap-2 border-b border-gray-100 pb-4 md:flex-row md:items-center">
      <Link href={to}>
        <a className="flex w-full gap-2 md:gap-4">
          <div className="relative aspect-square w-full max-w-[120px] flex-shrink-0 overflow-hidden rounded-[10px] md:max-w-[150px]">
            <div className="justify-centers absolute top-0 right-0 z-10 m-2 flex items-center gap-1 rounded-[10px] bg-gray-400 px-2 py-1 text-white shadow-md">
              <Timer size={16} />
              <p className="text-sm">{time}</p>
            </div>
            <Image
              src="https://res.cloudinary.com/dppgyhery/image/upload/v1631456018/samples/ecommerce/leather-bag-gray.jpg"
              layout="fill"
              objectFit="cover"
              alt="item image"
            />
          </div>
          <div className="flex w-full flex-col gap-1 text-gray-400">
            <p className="text-ellipsis whitespace-nowrap font-display font-semibold text-black-light">
              {name}
            </p>
            <p className="text-[15px] font-medium">Exchange for:</p>
            <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[15px]">
              {description}
            </p>
            <div className="flex items-center gap-1 text-black-light">
              <Need />
              <p className="font-display text-sm font-semibold">{offers}</p>
            </div>
          </div>
        </a>
      </Link>
      <div className="self-end md:self-center">
        <Button autoWidth={true} secondary={true}>
          <TrashCan size={24} />
          <p className="hidden md:block">Remove</p>
        </Button>
        {/* <CircleButton icon={<TrashCan size={24} />} /> */}
      </div>
    </li>
  );
}
