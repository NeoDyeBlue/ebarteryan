import { Timer, Need } from "@carbon/icons-react";
import Image from "next/image";
import Link from "next/link";

export default function ItemCard({
  image,
  name,
  exchangeFor,
  time,
  offers,
  to,
}) {
  return (
    <Link href={to}>
      <a className="flex max-h-[400px] flex-col gap-2">
        <div className="relative aspect-square min-h-[150px] w-full overflow-hidden rounded-[10px] bg-gray-100">
          <div className="justify-centers absolute top-0 right-0 z-10 m-2 flex items-center gap-1 rounded-[10px] bg-gray-400 px-2 py-1 text-white shadow-md">
            <Timer size={16} />
            <p className="text-sm">{time}</p>
          </div>
          <Image
            src={
              image
                ? image
                : "https://res.cloudinary.com/dppgyhery/image/upload/v1631456018/samples/ecommerce/leather-bag-gray.jpg"
            }
            layout="fill"
            objectFit="cover"
            placeholder="blur"
            blurDataURL="/images/placeholer.png"
          />
        </div>
        <div className="flex flex-col gap-1 text-gray-400">
          <p className="max-h-full overflow-hidden text-ellipsis whitespace-nowrap font-display font-semibold text-black-light">
            {name}
          </p>
          <p className="text-[15px] font-medium">Exchange for:</p>
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[15px]">
            {exchangeFor}
          </p>
        </div>
        <div className="flex items-center gap-1 self-end text-black-light">
          <Need />
          <p className="font-display text-sm font-semibold">{offers}</p>
        </div>
      </a>
    </Link>
  );
}
