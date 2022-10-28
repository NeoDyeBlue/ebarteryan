import { useSelect } from "downshift";
import { CaretDown, CaretUp } from "@carbon/icons-react";
// import "react-dropdown/style.css";
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
  const [selectedItem, setSelectedItem] = useState(meta.value);
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
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
      setSelectedItem(newSelectedItem);
    },
  });

  useEffect(() => {
    helpers.setValue(selectedItem);
  }, [selectedItem]);

  // console.log(meta.touched);

  return (
    <div
      className="relative"
      id={name}
      onBlur={field.onBlur}
      // onClick={() => helpers.setTouched(!isOpen ? true : false)}
      // onBlur={(event) => helpers.setTouched(!isOpen ? true : false)}
    >
      <div className="flex flex-col gap-2">
        {label && (
          <label {...getLabelProps()} className="font-display font-medium">
            {label}
          </label>
        )}
        <button
          name={name}
          // onBlur={() => helpers.setTouched(!isOpen)}
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
          <span className="font-body text-gray-300">
            {selectedItem ? selectedItem : placeholder}
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
              // onClick={selectItem}
              {...getItemProps({ item, index })}
            >
              <span>{item}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
