import { Filter } from "@carbon/icons-react";
import classNames from "classnames";

export default function FilterButton({ isActive = false, onClick = () => {} }) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        "flex items-center gap-1 rounded-full border border-gray-100 px-4 py-2 font-display font-medium hover:shadow-md",
        {
          "border-green-500 text-green-500": isActive,
        }
      )}
    >
      <Filter size={24} /> Filter
    </button>
  );
}
