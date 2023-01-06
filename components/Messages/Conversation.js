import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import ChatInput from "./ChatInput";
import useMessagesStore from "../../store/useMessagesStore";
import { CircleButton } from "../Buttons";
import { Add } from "@carbon/icons-react";

export default function Conversation({ onClose, forPopup = false }) {
  const { conversation } = useMessagesStore();
  return (
    <>
      {conversation ? (
        <div
          className="grid max-h-full min-h-full w-full grid-cols-1 
grid-rows-[auto_1fr_auto] overflow-hidden"
        >
          <div className="w-full border-b border-gray-100 px-4">
            <ChatHeader showClose={forPopup} onClose={onClose} />
          </div>
          <div className="custom-scrollbar min-h-full overflow-y-auto">
            <ChatContainer />
          </div>
          <div className="w-full border-t border-gray-100 px-4">
            <ChatInput />
          </div>
        </div>
      ) : (
        <div
          className="relative flex max-h-full min-h-full w-full items-center justify-center overflow-hidden
      p-6"
        >
          {forPopup && (
            <div className="absolute top-0 right-0 px-4 py-3">
              <CircleButton
                onClick={onClose}
                icon={<Add size={32} className="rotate-[135deg]" />}
              />
            </div>
          )}
          <p className="text-center text-lg text-gray-200">
            Select a conversation
          </p>
        </div>
      )}
    </>
  );
}
