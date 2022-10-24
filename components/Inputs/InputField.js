import { Information, View, ViewOff } from "@carbon/icons-react";
import { useState } from "react";

export default function InputField({
  type,
  name,
  value,
  required,
  placeholder,
  onChange,
  label,
  infoMessage,
}) {
  const [showPass, setShowPass] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center">
        {label && (
          <label htmlFor={name} className="font-display font-medium">
            {label}
          </label>
        )}
        {type == "password" ? (
          <button
            type="button"
            className="ml-auto"
            onClick={() => setShowPass((prev) => !prev)}
          >
            {!showPass && <View size={20} />}
            {showPass && <ViewOff size={20} />}
          </button>
        ) : null}
      </div>
      <input
        type={type == "password" ? (showPass ? "text" : "password") : type}
        name={name}
        value={value}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-[10px] border border-gray-200 bg-white 
        p-4 font-body placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500"
        onChange={onChange}
      ></input>
      {infoMessage && (
        <p className="flex gap-1 text-sm text-gray-200">
          <span>
            <Information size={16} />
          </span>
          {infoMessage}
        </p>
      )}
    </div>
  );
}
