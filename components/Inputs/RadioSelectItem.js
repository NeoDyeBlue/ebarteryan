import { RadioButton, RadioButtonChecked } from "@carbon/icons-react";
import { useField } from "formik";

export default function RadioSelectItem({ children, long, checked, ...props }) {
  const [field, meta] = useField(props);
  return (
    <label className={`flex gap-4 ${long ? "items-start" : ""} cursor-pointer`}>
      <input
        type="radio"
        className="hidden"
        {...field}
        {...props}
        checked={checked}
      />
      <div className={`relative ${long ? "mt-1" : ""}`}>
        <span
          className={`text-gray-300 ${
            checked ? "opacity-0" : ""
          } transition-opacity`}
        >
          <RadioButton size={24} />
        </span>
        <span
          className={`absolute top-0 left-0 z-10 text-green-500 opacity-0 ${
            checked ? "opacity-100" : ""
          } transition-opacity`}
        >
          <RadioButtonChecked size={24} />
        </span>
      </div>
      {children}
    </label>
  );
}
