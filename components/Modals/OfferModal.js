import { Add } from "@carbon/icons-react";
import { CircleButton } from "../Buttons";
import { OfferForm } from "../Forms";

export default function OfferModal({ onClose }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-shrink-0 items-center justify-between">
        <h1 className="text-2xl font-semibold">Create an Offer</h1>
        <CircleButton
          onClick={onClose}
          icon={<Add className="rotate-[135deg]" size={32} />}
        />
      </div>
      <OfferForm />
    </div>
  );
}
