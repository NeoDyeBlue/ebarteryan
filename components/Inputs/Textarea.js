import { useRef } from "react";

export default function Textarea({ label, placeholder }) {
  const textBoxRef = useRef(null);
  return (
    <div className="flex flex-col gap-1">
      {label && <p className="font-display font-medium">{label}</p>}
      <div
        className="min-h-[100px] w-full rounded-[10px] border border-gray-100 bg-white
            p-4 font-body placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500"
        ref={textBoxRef}
        contentEditable="true"
        // onInput={}
        suppressContentEditableWarning="true"
        role="textbox"
        placeholder={placeholder}
      ></div>
    </div>
  );
}
