import { Add } from "@carbon/icons-react";
import Image from "next/image";

export default function ImageSelectorItem({ src, onRemove }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-[10px]">
      <button
        onClick={onRemove}
        type="button"
        className="absolute top-[4px] right-[4px] z-10 flex h-[20px] w-[20px] rotate-[135deg] items-center justify-center rounded-full bg-white shadow-md"
      >
        <Add size={24} />
      </button>
      <Image src={src} layout="fill" objectFit="cover" alt="selected image" />
    </div>
  );
}
