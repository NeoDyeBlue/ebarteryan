import { BadgedIcon } from "../Icons";
import { Chat, Launch } from "@carbon/icons-react";
import { useRouter } from "next/router";
import { MessageList, Conversation } from "../Messages";
import useMessagesStore from "../../store/useMessagesStore";
import { CircleButton } from "../Buttons/";
import useOnClickOutside from "../../lib/hooks/useOnClickOutside";
import { useRef } from "react";

export default function MessagesPopup({ className, hasBadge }) {
  const router = useRouter();
  //stores
  const popupRef = useRef();
  const { isMessagesOpen, setIsMessagesOpen } = useMessagesStore();

  useOnClickOutside(popupRef, () => setIsMessagesOpen(false));

  return (
    <div className={className} ref={popupRef}>
      <div
        className={`mx-auto flex justify-end transition-transform duration-500 lg:container ${
          isMessagesOpen
            ? "translate-3d-0"
            : "translate-y-[75vh] lg:translate-y-[calc(70vh-0.75rem*-1)]"
        }`}
      >
        <div className="pointer-events-none flex flex-col items-end">
          <div
            style={{ perspective: "100px" }}
            className="pointer-events-auto hidden lg:block"
          >
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
            className="pointer-events-auto z-10 flex h-[75vh] w-screen overflow-hidden rounded-t-[10px] border
        border-gray-100 bg-white shadow-lg lg:mb-3 lg:h-[70vh] lg:w-[50vw] lg:rounded-[10px]"
          >
            <div className="hidden w-full max-w-[280px] flex-col border-r border-gray-100 lg:flex">
              <div className="mb-4 flex items-center justify-between px-4 pt-4">
                <h1 className="text-lg font-semibold">Messages</h1>
                <CircleButton
                  onClick={() => router.push("/messages")}
                  icon={<Launch size={20} />}
                />
              </div>
              <MessageList />
            </div>
            <Conversation forPopup onClose={() => setIsMessagesOpen(false)} />
          </div>
        </div>
      </div>
    </div>
  );
}
