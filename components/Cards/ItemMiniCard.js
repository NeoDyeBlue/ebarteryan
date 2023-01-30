import Image from "next/image";
import format from "date-fns/format";
import { Warning } from "@carbon/icons-react";

export default function ItemMiniCard({
  from,
  itemName,
  image,
  createdAt,
  isNull = false,
}) {
  return (
    <div className="flex w-full items-start gap-2 rounded-[10px]">
      <div
        className={`relative aspect-square w-full max-w-[100px] overflow-hidden rounded-[10px]
       ${
         isNull
           ? "flex items-center justify-center bg-gray-100 p-2 text-center"
           : ""
       }`}
      >
        {isNull ? (
          <Warning size={36} className="text-white" />
        ) : (
          <Image src={image} layout="fill" objectFit="cover" alt="item image" />
        )}
      </div>
      <div className={`flex h-full flex-col ${isNull ? "my-auto" : ""}`}>
        {isNull ? (
          <>
            <p className="w-full overflow-hidden overflow-ellipsis font-display font-medium">
              Item Unavailable
            </p>
            <p className="overflow-hidden overflow-ellipsis text-sm">
              Item is deleted or removed
            </p>
          </>
        ) : (
          <>
            <p className="overflow-hidden overflow-ellipsis text-sm">{from}</p>
            <p className="w-full overflow-hidden overflow-ellipsis font-display font-medium">
              {itemName}
            </p>
            <p className="text-xs text-gray-200">
              {format(new Date(createdAt), "PP")}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
