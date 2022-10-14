import { Send, Image as ImageIcon } from "@carbon/icons-react";

export default function ChatInput() {
  return (
    <div className="flex items-end gap-3 py-3">
      <button className="h-[40px] text-green-500">
        <ImageIcon size={32} />
      </button>
      <div
        className="max-h-[100px] w-full overflow-y-auto break-all rounded-[10px] bg-gray-100/50 bg-white
        px-3 py-2 font-body placeholder-gray-100 focus:outline-none"
        // ref={textBoxRef}
        contentEditable="true"
        // onInput={}
        suppressContentEditableWarning="true"
        role="textbox"
        placeholder="Enter message here"
      ></div>
      <button className="h-[40px] text-green-500">
        <Send size={32} />
      </button>
    </div>
  );
}
