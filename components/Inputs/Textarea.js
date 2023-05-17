import TextareaAutosize from "react-textarea-autosize";
import { Information, Error } from "@carbon/icons-react";
import { useField } from "formik";

export default function Textarea({ label, infoMessage, size, ...props }) {
  // const textBoxRef = useRef(null);
  const [field, meta] = useField(props);
  return (
    <div className="flex w-full flex-col gap-2">
      {label && <p className="font-display font-medium">{label}</p>}
      <TextareaAutosize
        {...field}
        {...props}
        className={`custom-scrollbar max-h-[150px] w-full resize-none rounded-[10px] border
         bg-white font-body placeholder-gray-300 focus:outline-none focus:ring-1
        ${
          meta.error && meta.touched
            ? "border-danger-500 focus:ring-danger-500"
            : "border-gray-200 focus:ring-green-500"
        } ${size == "small" ? "px-3 py-2" : "p-4"}`}
      />
      {infoMessage && (meta.touched ? !meta.error : !meta.touched) && (
        <p className="flex gap-1 text-sm text-gray-200">
          <span>
            <Information size={16} className="-mt-[2px]" />
          </span>
          {infoMessage}
        </p>
      )}
      {meta.error && meta.touched && (
        <p className="flex gap-1 text-sm text-danger-500">
          {/* <span>
            <Error size={16} className="-mt-[2px]" />
          </span> */}
          {meta.error}
        </p>
      )}
    </div>
  );
}
