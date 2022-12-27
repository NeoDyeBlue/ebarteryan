import { BadgedIcon } from "../Icons";
import { Chat } from "@carbon/icons-react";
import { useState } from "react";
import {
  ChatHeader,
  ChatContainer,
  ChatInput,
  ChatBubble,
  MessageList,
  MessageListItem,
  MessageSearchBox,
} from "../Messages";
import useMessagesStore from "../../store/useMessagesStore";

import { OverflowMenuVertical } from "@carbon/icons-react";
import { CircleButton } from "../Buttons/";

export default function MessagesPopup({ className, hasBadge }) {
  const userId = 1;

  //stores
  const { isMessagesOpen, setIsMessagesOpen } = useMessagesStore();
  const chats = [
    {
      id: 1,
      sender: {
        id: 1,
        name: "User Name",
        image: {
          url: "https://res.cloudinary.com/dppgyhery/image/upload/v1639759887/idiary/users/1005/xoyowlqk13x4znkcu63p.jpg",
        },
      },
      type: "text",
      content: "Hello",
    },
    {
      id: 2,
      sender: {
        id: 2,
        name: "User Name",
        image: {
          url: "https://res.cloudinary.com/dppgyhery/image/upload/v1639759887/idiary/users/1005/xoyowlqk13x4znkcu63p.jpg",
        },
      },
      type: "text",
      content: "Hello",
    },
    {
      id: 3,
      sender: {
        id: 2,
        name: "User Name",
        image: {
          url: "https://res.cloudinary.com/dppgyhery/image/upload/v1639759887/idiary/users/1005/xoyowlqk13x4znkcu63p.jpg",
        },
      },
      type: "text",
      content: "Hello",
    },
  ];

  const chatBubbles = chats.map((message, index) => {
    // console.log(message);
    let isFromUser = message.sender.id == userId ? true : false;
    if (index + 1 <= chats.length - 1) {
      if (message.sender.id == chats[index + 1].sender.id) {
        return (
          <ChatBubble
            key={index}
            isFromUser={isFromUser}
            consecutive={true}
            content={message.content}
            type={message.type}
          />
        );
      } else {
        return (
          <ChatBubble
            key={index}
            isFromUser={isFromUser}
            consecutive={false}
            content={message.content}
            userPic={message.sender.image.url}
            type={message.type}
          />
        );
      }
    } else {
      return (
        <ChatBubble
          key={index}
          isFromUser={isFromUser}
          consecutive={false}
          content={message.content}
          userPic={message.sender.image.url}
          type={message.type}
        />
      );
    }
  });

  // const [isMessagesOpen, setIsOpen] = useState(false);

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
              <div className="custom-scrollbar overflow-y-auto overflow-x-hidden px-4">
                <MessageList>
                  <MessageListItem
                    photo="https://res.cloudinary.com/dppgyhery/image/upload/v1639759887/idiary/users/1005/xoyowlqk13x4znkcu63p.jpg"
                    sender="Other Userassssss"
                    subtitle="Other: Good work!"
                  />
                  <MessageListItem
                    photo="https://res.cloudinary.com/dppgyhery/image/upload/v1639759887/idiary/users/1005/xoyowlqk13x4znkcu63p.jpg"
                    sender="OtherLong UserNamesss"
                    subtitle="Other: Good work!"
                    unread={true}
                  />
                  <MessageListItem
                    photo="https://res.cloudinary.com/dppgyhery/image/upload/v1639759887/idiary/users/1005/xoyowlqk13x4znkcu63p.jpg"
                    sender="Other User"
                    subtitle="Other: Good work!"
                  />
                  <MessageListItem
                    photo="https://res.cloudinary.com/dppgyhery/image/upload/v1639759887/idiary/users/1005/xoyowlqk13x4znkcu63p.jpg"
                    sender="Other User"
                    subtitle="Other: Good work!"
                  />
                  <MessageListItem
                    photo="https://res.cloudinary.com/dppgyhery/image/upload/v1639759887/idiary/users/1005/xoyowlqk13x4znkcu63p.jpg"
                    sender="Other User"
                    subtitle="Other: Good work!"
                  />
                </MessageList>
              </div>
            </div>
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
                <ChatContainer>{chatBubbles}</ChatContainer>
              </div>
              <div className="w-full border-t border-gray-100 px-4">
                <ChatInput />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
