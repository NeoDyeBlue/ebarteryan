import dynamic from "next/dynamic";
const Map = dynamic(() => import("../Map/Map"), {
  ssr: false,
});
import { Add } from "@carbon/icons-react";
import CircleButton from "../CircleButton";

export default function LocationModal({ onClose }) {
  return (
    <div
      className="flex max-h-full min-h-full w-full flex-shrink-0 flex-col
    gap-4 rounded-[10px]"
    >
      <div className="flex flex-shrink-0 items-center justify-between">
        <h1 className="text-2xl font-semibold">Change Location</h1>
        <CircleButton
          onClick={onClose}
          icon={<Add className="rotate-[135deg]" size={32} />}
        />
      </div>
      <hr className="border-gray-100" />
      <Map withRadiusPicker={true} />
    </div>
  );
}
