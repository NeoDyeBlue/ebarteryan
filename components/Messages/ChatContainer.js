import { useSession } from "next-auth/react";
import usePaginate from "../../lib/hooks/usePaginate";
import useMessagesStore from "../../store/useMessagesStore";
import ChatBubble from "./ChatBubble";
import { DotLoader } from "react-spinners";
import InfiniteScroll from "react-infinite-scroller";
import { useEffect } from "react";

export default function ChatContainer({ children }) {
  //stores
  const { conversation, chatList, setChatList } = useMessagesStore();
  const { data: session, status } = useSession();

  const {
    data: chats,
    isLoading,
    isEndReached,
    error,
    setSize,
    size,
  } = usePaginate(`/api/messages/${conversation?._id}`, 20);

  useEffect(() => {
    if (chats.length) {
      setChatList(chats);
    }
  }, [chats, setChatList]);

  const chatBubbles = chatList.map((message, index) => {
    // console.log(message);
    let isFromUser = message.sender.id == session?.user?.id ? true : false;
    if (index + 1 <= chats.length - 1) {
      if (message.sender.id == chats[index + 1].sender.id) {
        return (
          <ChatBubble
            key={index}
            isFromUser={isFromUser}
            consecutive={true}
            images={message.images}
            offer={message?.offer}
            text={message.body}
            type={message.type}
          />
        );
      } else {
        return (
          <ChatBubble
            key={index}
            isFromUser={isFromUser}
            consecutive={false}
            userPic={message.sender.image.url}
            images={message.images}
            offer={message?.offer}
            text={message.body}
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
          images={message.images}
          offer={message?.offer}
          text={message.body}
          type={message.type}
          userPic={message.sender.image.url}
        />
      );
    }
  });

  return (
    <div className="flex h-full w-full">
      <InfiniteScroll
        element="ul"
        className="flex h-full w-full flex-col overflow-auto"
        pageStart={size}
        loadMore={() => {
          if (!isLoading) {
            setSize(size + 1);
          }
        }}
        hasMore={!isEndReached}
        isReverse
        loader={
          <div className="flex h-[48px] flex-shrink-0 items-center justify-center">
            <DotLoader color="#C7EF83" size={32} />
          </div>
        }
        useWindow={false}
      >
        {chatBubbles}
      </InfiniteScroll>
    </div>
  );
}
