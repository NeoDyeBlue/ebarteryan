import TextareaAutosize from "react-textarea-autosize";
import { Information, Error } from "@carbon/icons-react";
import { useField } from "formik";

export default function Textarea({ label, infoMessage, ...props }) {
  // const textBoxRef = useRef(null);
  const [field, meta] = useField(props);
  // console.log(meta, field);
  return (
    <div className="flex w-full flex-col gap-2">
      {label && <p className="font-display font-medium">{label}</p>}
      {/* <div
        className="min-h-[100px] w-full break-all rounded-[10px] border border-gray-200 bg-white
            p-4 font-body placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500"
        ref={textBoxRef}
        contentEditable="true"
        // onInput={}
        suppressContentEditableWarning="true"
        role="textbox"
        {...props}
      ></div> */}
      <TextareaAutosize
        {...field}
        {...props}
        className={`w-full resize-none rounded-[10px] border bg-white
        p-4 font-body placeholder-gray-300 focus:outline-none focus:ring-1
        ${
          meta.error && meta.touched
            ? "border-danger-500 focus:ring-danger-500"
            : "border-gray-200 focus:ring-green-500"
        }`}
      />
      {infoMessage && !meta.error && (
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
