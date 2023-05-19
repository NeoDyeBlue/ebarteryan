import { useEffect, useState } from "react";
import FilterItemBadge from "./FilterItemBadge";
import { RadioButton, RadioButtonChecked } from "@carbon/icons-react";
import classNames from "classnames";

export default function FilterOption({
  type,
  values,
  multiple = false,
  label,
  onChange = () => {},
  initialValue = [],
}) {
  const [optionValue, setOptionValue] = useState(initialValue || []);

  useEffect(() => {
    onChange(optionValue);
  }, [optionValue]);

  return (
    <div className="flex flex-col gap-2">
      <p className="font-display font-semibold">{label}</p>
      {/* {type == "badges" && (
        <div className="flex flex-wrap gap-2">
          {values.map((value, index) => (
            <FilterItemBadge
              value={value}
              key={index}
              isSelected={optionValue.includes(value)}
              onClick={() =>
                setOptionValue((prev) => {
                  if (prev.includes(value)) {
                    return prev.filter((val) => val == value);
                  } else {
                    return [...prev, value];
                  }
                })
              }
            />
          ))}
        </div>
      )} */}
      {type == "radio" &&
        values.map((value, index) => (
          <label key={index} className={`flex cursor-pointer gap-4`}>
            <input
              type="radio"
              className="hidden"
              checked={optionValue[0] == value}
              onChange={() => setOptionValue([value])}
            />
            <div className={`relative`}>
              <span
                className={`text-gray-300 ${
                  optionValue[0] == value ? "opacity-0" : ""
                } transition-opacity`}
              >
                <RadioButton size={24} />
              </span>
              <span
                className={`absolute top-0 left-0 z-10 text-green-500 opacity-0 ${
                  optionValue[0] == value ? "opacity-100" : ""
                } transition-opacity`}
              >
                <RadioButtonChecked size={24} />
              </span>
            </div>
            {value}
          </label>
        ))}
      {type == "badges" && (
        <div className="flex flex-wrap gap-2">
          {values.map((value, index) => (
            <label
              key={index}
              className={classNames(
                `flex w-fit cursor-pointer rounded-full border px-3 py-2 text-sm`,
                {
                  "border-green-500 bg-green-100 text-green-500":
                    optionValue.includes(value),
                  "border-gray-100/30 bg-gray-100/30":
                    !optionValue.includes(value),
                }
              )}
            >
              <input
                type="checkbox"
                className="hidden"
                checked={optionValue.includes(value)}
                onChange={() =>
                  setOptionValue((prev) => {
                    if (prev.includes(value)) {
                      return prev.filter((val) => val !== value);
                    } else {
                      return [...prev, value];
                    }
                  })
                }
              />
              {value}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
