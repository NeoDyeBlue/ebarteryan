import InputField from "../Inputs/InputField";
import Textarea from "../Inputs/Textarea";
import ImageSelector from "../Inputs/ImageSelector";
import Button from "../Button";
import { Add, Location } from "@carbon/icons-react";
import CircleButton from "../CircleButton";

export default function OfferModal({ onClose }) {
  return (
    <form className="flex flex-col gap-4">
      <div className="flex flex-shrink-0 items-center justify-between">
        <h1 className="text-2xl font-semibold">Create an Offer</h1>
        <CircleButton
          onClick={onClose}
          icon={<Add className="rotate-[135deg]" size={32} />}
        />
      </div>
      <div className="flex flex-col gap-4">
        <p className="border-b border-gray-100 pb-2 text-sm text-gray-300">
          Details
        </p>
        <ImageSelector
          label="Upload Photos"
          infoMessage="You can upload up to 10 photos only."
        />
        <InputField
          label="Item Name"
          name="name"
          placeholder="Enter Item Name"
        />
        <Textarea label="Description" placeholder="Item description..." />
      </div>
      <div className="flex flex-col gap-4">
        <p className="border-b border-gray-100 pb-2 text-sm text-gray-300">
          Location
        </p>
        <div className="flex gap-2 py-2">
          <div className="flex items-center gap-1">
            <Location size={20} />
            <p className="font-medium">Pandi, Bulacan</p>
          </div>
          <span>|</span>
          <button
            type="button"
            className="font-display font-medium text-green-500"
          >
            Change
          </button>
        </div>
      </div>
      <Button>
        <p>Offer</p>
      </Button>
    </form>
  );
}
