import { useSelect } from "downshift";
import { CaretDown, CaretUp, Information } from "@carbon/icons-react";
import { useField } from "formik";
import { useState, useEffect } from "react";

export default function DropdownSelect({
  items,
  placeholder,
  label,
  infoMessage,
  name,
}) {
  const [field, meta, helpers] = useField(name);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (items.length) {
      setSelectedItem(
        items.find((item) => item?.value == meta.value || item == meta.value)
      );
    }
  }, [items, meta.value]);

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    // selectedItem,
    getItemProps,
  } = useSelect({
    items,
    selectedItem,
    // defaultSelectedItem: initialSelected,
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
      setSelectedItem(newSelectedItem);
      helpers.setValue(
        newSelectedItem?.value ? newSelectedItem.value : newSelectedItem
      );
    },
  });

  return (
    <div className="relative">
      <div className="flex flex-col gap-2" id={name} onBlur={field.onBlur}>
        {label && (
          <label {...getLabelProps()} className="font-display font-medium">
            {label}
          </label>
        )}
        <button
          name={name}
          aria-label="toggle menu"
          className={`flex w-full items-center justify-between rounded-[10px] border bg-white
          p-4 font-body placeholder-gray-300 focus:outline-none focus:ring-1
          ${
            meta.error && meta.touched && !isOpen
              ? "border-danger-500 focus:ring-danger-500"
              : "border-gray-200 focus:ring-green-500"
          }`}
          type="button"
          {...getToggleButtonProps()}
        >
          <span
            className={`font-body capitalize ${
              selectedItem ? "text-black-light" : "text-gray-300"
            }`}
          >
            {selectedItem
              ? selectedItem?.name
                ? selectedItem.name
                : selectedItem
              : placeholder}
          </span>
          <span className="text-black-light">
            {isOpen ? <CaretUp size={16} /> : <CaretDown size={16} />}
          </span>
        </button>
        {infoMessage && (!meta.error || !meta.touched) && (
          <p className="flex gap-1 text-sm text-gray-200">
            <span>
              <Information size={16} className="-mt-[2px]" />
            </span>
            {infoMessage}
          </p>
        )}
        {meta.error && meta.touched && !isOpen && (
          <p className="flex gap-1 text-sm text-danger-500">
            {/* <span>
            <Error size={16} className="-mt-[2px]" />
          </span> */}
            {meta.error}
          </p>
        )}
      </div>
      <ul
        {...getMenuProps()}
        className="custom-scrollbar absolute z-20 mt-1 max-h-80 w-full
        overflow-x-auto rounded-[10px] bg-white shadow-[0_0_8px_0_rgba(0,0,0,0.2)]"
      >
        {isOpen &&
          items.map((item, index) => (
            <li
              className={`
                ${highlightedIndex === index && "bg-green-300"}
                ${
                  (selectedItem === item ||
                    selectedItem?.value == item?.value) &&
                  "font-bold"
                }
                flex cursor-pointer flex-col p-4 font-body capitalize shadow-sm
              `}
              key={index}
              // onClick={selectItem}
              {...getItemProps({ item, index })}
            >
              <span>{item?.name ? item.name : item}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
