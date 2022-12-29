import { BadgedIcon } from "../Icons";
import { Chat, Add } from "@carbon/icons-react";
import {
  ChatHeader,
  ChatContainer,
  ChatInput,
  MessageList,
  MessageSearchBox,
} from "../Messages";
import useMessagesStore from "../../store/useMessagesStore";
import { OverflowMenuVertical } from "@carbon/icons-react";
import { CircleButton } from "../Buttons/";

export default function MessagesPopup({ className, hasBadge }) {
  //stores
  const { isMessagesOpen, setIsMessagesOpen, conversation } =
    useMessagesStore();

  return (
    <div className={className}>
      <div
        className={`container mx-auto flex justify-end transition-transform duration-500 ${
          isMessagesOpen
            ? "translate-y-0"
            : "translate-y-[calc(70vh-0.75rem*-1)]"
        }`}
      >
        <div className="pointer-events-none flex flex-col items-end">
          <div style={{ perspective: "100px" }} className="pointer-events-auto">
            <button
              style={{
                ...(isMessagesOpen
                  ? {
                      transform:
                        "rotateX(180deg) translateX(-1rem) translateY(-1px)",
                      boxShadow: "none",
                    }
                  : {}),
              }}
              onClick={() => setIsMessagesOpen(true)}
              className="relative flex origin-bottom cursor-pointer 
        items-center gap-3 rounded-t-[10px] border border-b-0 border-gray-100 bg-white px-4 py-3
        font-display font-medium text-black-light shadow-lg transition-all delay-300 duration-300
        "
            >
              <BadgedIcon hasBadge={true}>
                <Chat size={24} />
              </BadgedIcon>
              <p>Messages</p>
            </button>
          </div>
          <div
            className="pointer-events-auto z-10 mb-3 flex h-[70vh] w-[50vw]
        overflow-hidden rounded-[10px] border border-gray-100 bg-white shadow-lg"
          >
            <div className="flex w-full max-w-[280px] flex-col gap-4 border-r border-gray-100">
              <div className="flex items-center justify-between gap-4 px-4 pt-4">
                <h1 className="text-lg font-semibold">Messages</h1>
                <CircleButton icon={<OverflowMenuVertical size={24} />} />
              </div>
              <div className="px-4">
                <MessageSearchBox />
              </div>
              <MessageList />
            </div>
            {conversation ? (
              <div
                className="grid max-h-full min-h-full w-full grid-cols-1 
            grid-rows-[auto_1fr_auto] overflow-hidden"
              >
                <div className="w-full border-b border-gray-100 px-4">
                  <ChatHeader
                    showClose={true}
                    onClose={() => setIsMessagesOpen(false)}
                  />
                </div>
                <div className="custom-scrollbar min-h-full overflow-y-auto px-4">
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
                <div className="absolute top-0 right-0 px-4 py-3">
                  <CircleButton
                    onClick={() => setIsMessagesOpen(false)}
                    icon={<Add size={32} className="rotate-[135deg]" />}
                  />
                </div>
                <p className="text-center text-lg text-gray-200">
                  Select a conversation
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
