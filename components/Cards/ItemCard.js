import { Timer, Need, ArrowsHorizontal } from "@carbon/icons-react";
import Image from "next/image";
import Link from "next/link";

export default function ItemCard({
  image,
  name,
  description,
  time,
  offers,
  to,
}) {
  return (
    <Link href={to}>
      <a className="flex flex-col gap-2 max-h-[400px]">
        <div className="relative w-full min-h-[150px] overflow-hidden rounded-[10px] aspect-square">
          <div className="bg-cyan rounded-[10px] flex items-center justify-centers px-2 py-1 absolute m-2 top-0 right-0 z-10 gap-1">
            <Timer size={16} />
            <p className="text-sm">{time}</p>
          </div>
          <Image
            src="https://res.cloudinary.com/dppgyhery/image/upload/v1631456018/samples/ecommerce/leather-bag-gray.jpg"
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="flex flex-col gap-1 text-gray-400">
          <p className="font-display font-semibold whitespace-nowrap text-ellipsis text-black-light">
            {name}
          </p>
          <p className="text-[15px] font-medium">Exchange for:</p>
          <p className="text-ellipsis text-[15px] overflow-hidden whitespace-nowrap">
            {description}
          </p>
        </div>
        <div className="flex gap-1 items-center text-black-light self-end">
          <Need />
          <p className="font-display font-semibold text-sm">{offers}</p>
        </div>
      </a>
    </Link>
  );
}
