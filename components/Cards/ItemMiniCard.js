import Image from "next/image";

export default function ItemMiniCard({ from, itemName }) {
  return (
    <div className="flex w-full items-start gap-2 rounded-[10px]">
      <div className="relative aspect-square w-full max-w-[100px] overflow-hidden rounded-[10px]">
        <Image
          src="https://res.cloudinary.com/dppgyhery/image/upload/v1631456018/samples/ecommerce/leather-bag-gray.jpg"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="flex flex-col">
        <p className="overflow-hidden overflow-ellipsis text-sm text-gray-200">
          {from}
        </p>
        <p className="w-full overflow-hidden overflow-ellipsis font-display">
          {itemName}
        </p>
      </div>
    </div>
  );
}
