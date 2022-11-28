import Image from "next/image";
import format from "date-fns/format";

export default function ItemMiniCard({ from, itemName, image, createdAt }) {
  return (
    <div className="flex w-full items-start gap-2 rounded-[10px]">
      <div className="relative aspect-square w-full max-w-[100px] overflow-hidden rounded-[10px]">
        <Image src={image} layout="fill" objectFit="cover" alt="item image" />
      </div>
      <div className="flex flex-col">
        <p className="overflow-hidden overflow-ellipsis text-sm">{from}</p>
        <p className="w-full overflow-hidden overflow-ellipsis font-display font-medium">
          {itemName}
        </p>
        <p className="text-xs text-gray-200">
          {format(new Date(createdAt), "PP")}
        </p>
      </div>
    </div>
  );
}
