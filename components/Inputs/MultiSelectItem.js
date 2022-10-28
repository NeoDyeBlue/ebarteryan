import { Checkbox, CheckboxCheckedFilled } from "@carbon/icons-react";
import { useField } from "formik";

export default function MultiSelectItem({ children, checked, long, ...props }) {
  const [field, meta, helpers] = useField(props);
  return (
    <label className={`flex gap-4 ${long ? "items-start" : ""} cursor-pointer`}>
      <input
        type="checkbox"
        className="hidden"
        name={props.name}
        checked={checked}
        {...field}
        {...props}
      />
      <div className={`relative ${long ? "mt-1" : ""}`}>
        <span
          className={`text-gray-300 ${
            checked ? "opacity-0" : ""
          } transition-opacity`}
        >
          <Checkbox size={24} />
        </span>
        <span
          className={`absolute top-0 left-0 z-10 text-green-500 opacity-0 ${
            checked ? "opacity-100" : ""
          } transition-opacity`}
        >
          <CheckboxCheckedFilled size={24} />
        </span>
      </div>
      {children}
    </label>
  );
}
