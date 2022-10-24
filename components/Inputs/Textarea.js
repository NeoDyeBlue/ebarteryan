import { useRef } from "react";

export default function Textarea({ label, placeholder, infoMessage }) {
  const textBoxRef = useRef(null);
  return (
    <div className="flex w-full flex-col gap-2">
      {label && <p className="font-display font-medium">{label}</p>}
      <div
        className="min-h-[100px] w-full break-all rounded-[10px] border border-gray-200 bg-white
            p-4 font-body placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500"
        ref={textBoxRef}
        contentEditable="true"
        // onInput={}
        suppressContentEditableWarning="true"
        role="textbox"
        placeholder={placeholder}
      ></div>
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
