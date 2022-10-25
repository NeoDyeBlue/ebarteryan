import { Information, View, ViewOff, Error } from "@carbon/icons-react";
import { useState } from "react";

export default function InputField({
  type,
  name,
  value,
  required,
  placeholder,
  onChange,
  onBlur,
  label,
  infoMessage,
  error,
  errorMessage,
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
        className={`w-full rounded-[10px] border bg-white 
        p-4 font-body placeholder-gray-300 focus:outline-none focus:ring-1
        ${
          error
            ? "border-danger-500 focus:ring-danger-500"
            : "border-gray-200 focus:ring-green-500"
        }`}
        onChange={onChange}
        onBlur={onBlur}
      ></input>
      {infoMessage && !error && (
        <p className="flex gap-1 text-sm text-gray-200">
          <span>
            <Information size={16} className="-mt-[2px]" />
          </span>
          {infoMessage}
        </p>
      )}
      {error && (
        <p className="flex gap-1 text-sm text-danger-500">
          <span>
            <Error size={16} className="-mt-[2px]" />
          </span>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
