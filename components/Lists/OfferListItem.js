import Image from "next/image";
import { Rating } from "react-simple-star-rating";
import { Location } from "@carbon/icons-react";

export default function OfferListItem({ fromUser = false }) {
  return (
    <li
      className={`flex flex-col gap-3 border-gray-100 bg-white md:flex-row
     md:gap-6 ${
       fromUser ? "rounded-[10px] border p-4 shadow-lg" : "border-b pb-4"
     }`}
    >
      <div className="flex items-center gap-4 self-start md:items-start">
        <div className="relative h-[48px] w-[48px] flex-shrink-0 overflow-hidden rounded-full">
          <Image
            src="https://res.cloudinary.com/dppgyhery/image/upload/v1639759887/idiary/users/1005/xoyowlqk13x4znkcu63p.jpg"
            layout="fill"
            // objectFit="cover"
          />
        </div>
        <div className="flex items-center">
          <div className="flex flex-col">
            <p className="min-w-[150px] font-display font-medium md:mt-[0.1rem]">
              {fromUser ? "You" : "John Paul Zoleta"}
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
        </div>
      </div>
      <div className="col-span-2 flex flex-col gap-3 md:col-span-1 md:col-start-2">
        <div className="flex flex-col">
          <p className="font-display text-xl font-semibold">Item Name</p>
          <div className="flex break-words text-sm text-gray-300">
            <p className="mt-[0.05rem]">Pandi, Bulacan • 1h ago</p>
          </div>
        </div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Pellentesque eu tincidunt tortor aliquam nulla.
        </p>
        <div className="grid max-w-[calc((0.25rem*2+300px))] grid-cols-[repeat(auto-fill,_minmax(100px,_100px))] gap-1 overflow-hidden">
          <div className="relative aspect-square w-full overflow-hidden rounded-md">
            <Image
              src="https://res.cloudinary.com/dppgyhery/image/upload/v1631456018/samples/ecommerce/leather-bag-gray.jpg"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="relative aspect-square w-full overflow-hidden rounded-md">
            <Image
              src="https://res.cloudinary.com/dppgyhery/image/upload/v1631456018/samples/ecommerce/leather-bag-gray.jpg"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="relative aspect-square w-full overflow-hidden rounded-md">
            <Image
              src="https://res.cloudinary.com/dppgyhery/image/upload/v1631456018/samples/ecommerce/leather-bag-gray.jpg"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="relative aspect-square w-full overflow-hidden rounded-md">
            <Image
              src="https://res.cloudinary.com/dppgyhery/image/upload/v1631456018/samples/ecommerce/leather-bag-gray.jpg"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
      </div>
    </li>
  );
}
