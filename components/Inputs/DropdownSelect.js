import { useSelect } from "downshift";
import { CaretDown, CaretUp } from "@carbon/icons-react";
// import "react-dropdown/style.css";

export default function DropdownSelect({
  items,
  selectedItem,
  handleSelectedItemChange,
  placeholder,
  label,
  id,
}) {
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items,
    selectedItem,
    onSelectedItemChange: handleSelectedItemChange,
  });
  return (
    <div className="relative" id={id}>
      <div className="flex flex-col gap-2">
        {label && (
          <label {...getLabelProps()} className="font-display font-medium">
            {label}
          </label>
        )}
        <button
          aria-label="toggle menu"
          className="flex w-full items-center justify-between rounded-[10px] border border-gray-100
            bg-white p-4 font-body focus:outline-none focus:ring-1 focus:ring-green-500"
          type="button"
          {...getToggleButtonProps()}
        >
          <span className="font-body text-gray-300">
            {selectedItem ? selectedItem : placeholder}
          </span>
          <span className="px-2 text-black-light">
            {isOpen ? <CaretUp size={16} /> : <CaretDown size={16} />}
          </span>
        </button>
      </div>
      <ul
        {...getMenuProps()}
        className="absolute z-10 mt-1 max-h-80 w-full overflow-x-auto
        rounded-[10px] bg-white shadow-[0_0_8px_0_rgba(0,0,0,0.2)]"
      >
        {isOpen &&
          items.map((item, index) => (
            <li
              className={`
                ${highlightedIndex === index && "bg-green-300"}
                ${selectedItem === item && "font-bold"}
                flex cursor-pointer flex-col p-4 font-body shadow-sm
              `}
              key={index}
              {...getItemProps({ item, index })}
            >
              <span>{item}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
