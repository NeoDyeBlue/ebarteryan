import { Edit, TrashCan } from "@carbon/icons-react";

export default function EditDeleteButtons({ onEditClick, onDeleteClick }) {
  return (
    <div className="flex gap-3">
      <button
        className="flex items-center justify-center gap-1 rounded-full border border-gray-300 bg-white
      p-2 font-medium text-gray-300 hover:text-black-light hover:shadow-md md:min-w-[100px] md:px-3"
      >
        <Edit size={20} />
        <p className="text-display hidden md:block">Edit</p>
      </button>
      <button
        className="flex items-center justify-center gap-1 rounded-full border border-gray-300 bg-white
      p-2 font-medium text-gray-300 hover:text-black-light hover:shadow-md md:min-w-[100px] md:px-3"
      >
        <TrashCan size={20} />
        <p className="text-display hidden md:block">Delete</p>
      </button>
    </div>
  );
}
