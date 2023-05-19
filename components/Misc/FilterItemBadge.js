import classNames from "classnames";

export default function FilterItemBadge({ value, isSelected = false }) {
  return (
    <div
      className={classNames("rounded-full bg-gray-100 px-2 py-1", {
        "bg-green-500 text-white": isSelected,
      })}
    >
      {value}
    </div>
  );
}
