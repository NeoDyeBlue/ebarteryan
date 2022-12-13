import { useSelect } from "downshift";
import { CaretDown, CaretUp } from "@carbon/icons-react";
import { useState, useEffect } from "react";

export default function DropdownSelect({
  items,
  placeholder,
  name,
  selected,
  onChange,
}) {
  //   const [selectedItem, setSelectedItem] = useState(selected);
  // const initialSelectedItem = items.find(
  //   (item) => item.value == selected || item == selected
  // );

  const [selectedItem, setSelectedItem] = useState(
    items.find((item) => item?.value == selected || item == selected)
  );

  // useEffect(() => {
  //   if (items.length) {
  //     setSelectedItem(
  //       items.find((item) => item?.value == selected || item == selected)
  //     );
  //   }
  // }, [items, selected]);

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items,
    selectedItem,
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
      setSelectedItem(newSelectedItem);
      // onChange(newSelectedItem ? newSelectedItem.value : newSelectedItem);
    },
  });

  useEffect(() => {
    onChange(selectedItem?.value ? selectedItem.value : selectedItem);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem]);

  return (
    <div className="relative" id={name}>
      <div className="flex flex-col gap-2">
        <button
          name={name}
          aria-label="toggle menu"
          className={`flex w-full items-center justify-between gap-2 rounded-[10px] border
          border-gray-200 bg-white px-4 py-1 font-body placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500`}
          type="button"
          {...getToggleButtonProps()}
        >
          <span
            className={`font-body text-sm capitalize ${
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
                ${highlightedIndex == index && "bg-green-300"}
                ${
                  (selectedItem == item || selectedItem.value == item.value) &&
                  "font-bold"
                }
                flex cursor-pointer flex-col p-4 font-body text-sm capitalize shadow-sm
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
