import Image from "next/image";
import { Rating } from "react-simple-star-rating";

export default function OfferListItem() {
  return (
    <li className="grid grid-cols-[auto_1fr] gap-4 border-b border-b-gray-100 pb-4">
      <div className="relative h-[48px] w-[48px] overflow-hidden rounded-full">
        <Image
          src="https://res.cloudinary.com/dppgyhery/image/upload/v1639759887/idiary/users/1005/xoyowlqk13x4znkcu63p.jpg"
          layout="fill"
          // objectFit="cover"
        />
      </div>
      <div className="flex items-center">
        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <p className="font-display font-medium">Barterer Name</p>
          <p className="text-sm text-gray-400">1h ago</p>
        </div>
      </div>
      <div className="col-span-2 flex flex-col gap-3 md:col-span-1 md:col-start-2">
        <p className="font-display text-xl font-semibold">Item Name</p>
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
      <div className="col-span-2 flex flex-col gap-1 md:col-span-1 md:col-start-2">
        <p className="font-display text-xs font-medium">Barterer Rating</p>
        <div className="-ml-[2px] flex w-full items-end justify-start gap-2">
          <Rating
            className="align-middle"
            transition
            allowHalfIcon
            fillColor="#85CB33"
            emptyColor="#D2D2D2"
            initialValue={4.5}
            readonly
            size={24}
          />
          <p>•</p>
          <p className="text-[15px]">10</p>
        </div>
      </div>
    </li>
  );
}
