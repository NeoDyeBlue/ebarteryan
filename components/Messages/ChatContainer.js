import { useSession } from "next-auth/react";
import usePaginate from "../../lib/hooks/usePaginate";
import useMessagesStore from "../../store/useMessagesStore";
import useSocketStore from "../../store/useSocketStore";
import ChatBubble from "./ChatBubble";
import { DotLoader } from "react-spinners";
// import InfiniteScroll from "react-infinite-scroller";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useRef, useMemo } from "react";
import format from "date-fns/format";

export default function ChatContainer() {
  const messagesEnd = useRef(null);

  //stores
  const { conversation, chatList, setChatList } = useMessagesStore();
  const { data: session, status } = useSession();
  const { socket } = useSocketStore();

  const {
    data: chats,
    isLoading,
    isEndReached,
    error,
    setSize,
    size,
  } = usePaginate(`/api/messages/${conversation?._id}`, 20);

  const reversedChats = useMemo(() => chatList.reverse(), [chatList]);

  //effects
  useEffect(() => {
    setChatList(chats.reverse());
  }, [chats, setChatList]);

  useEffect(() => {
    if (socket) {
      socket.on("chat:add", (chat) => {
        if (conversation && conversation._id == chat.conversation) {
          setChatList([...chatList, chat]);
        }
      });

      socket.on("chat:sent", (id) => {
        setChatList(
          chatList.map((chat) => {
            if (chat?.tempId == id) {
              return { ...chat, sent: true };
            }
            return chat;
          })
        );
      });

      socket.emit("conversation:check-has-unread", session && session.user.id);

      return () => {
        socket.off("chat:add");
        socket.off("chat:sent");
      };
    }
  }, [socket, chatList, setChatList, conversation, session]);

  const chatBubbles = useMemo(
    () =>
      reversedChats.reverse().map((message, index) => {
        let isFromUser = message.sender.id == session?.user?.id ? true : false;
        const prevMessage = chatList[index - 1];
        const showSeparator = prevMessage
          ? new Date(message.createdAt).setHours(0, 0, 0, 0) >
            new Date(prevMessage.createdAt).setHours(0, 0, 0, 0)
          : true;
        if (index + 1 <= chatList.length - 1) {
          if (
            message.sender.id == chatList[index + 1].sender.id ||
            message.sender._id == chatList[index + 1].sender._id
          ) {
            return (
              <>
                <ChatBubble
                  key={message?._id || message?.tempId || index}
                  isFromUser={isFromUser}
                  consecutive={true}
                  images={message.images}
                  offer={message?.offer}
                  text={message.body}
                  type={message.type}
                  sent={message?.sent}
                />
                {showSeparator && (
                  <p className="my-1 text-center text-xs text-gray-200">
                    {format(new Date(message.createdAt), "PPp")}
                  </p>
                )}
              </>
            );
          } else {
            return (
              <>
                <ChatBubble
                  key={message?._id || message?.tempId || index}
                  isFromUser={isFromUser}
                  consecutive={false}
                  userPic={message.sender.image.url}
                  images={message.images}
                  offer={message?.offer}
                  text={message.body}
                  type={message.type}
                  sent={message?.sent}
                />
                {showSeparator && (
                  <p className="my-1 text-center text-xs text-gray-200">
                    {format(new Date(message.createdAt), "PPp")}
                  </p>
                )}
              </>
            );
          }
        } else {
          return (
            <>
              <ChatBubble
                key={message?._id || message?.tempId || index}
                isFromUser={isFromUser}
                consecutive={false}
                images={message.images}
                offer={message?.offer}
                text={message.body}
                type={message.type}
                userPic={message.sender.image.url}
                sent={message?.sent}
              />
              {showSeparator && (
                <p className="my-1 text-center text-xs text-gray-200">
                  {format(new Date(message.createdAt), "PPp")}
                </p>
              )}
            </>
          );
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reversedChats]
  );

  return (
    <ul
      id="chatsContainer"
      className="custom-scrollbar container relative mx-auto flex h-full w-full
      flex-col-reverse overflow-auto py-4 md:mx-0 md:px-4"
    >
      {chatList.length ? (
        <InfiniteScroll
          dataLength={chatList.length}
          // ref={chatsContainer}
          // style={{ display: "flex", flexDirection: "column-reverse" }}
          className="flex flex-col-reverse"
          inverse={true}
          next={() => setSize(size + 1)}
          hasMore={!isEndReached}
          scrollableTarget="chatsContainer"
          loader={
            <li className="my-auto flex h-[48px] flex-shrink-0 items-center justify-center">
              <DotLoader color="#C7EF83" size={32} />
            </li>
          }
        >
          {chatBubbles.reverse()}
          <li ref={messagesEnd}></li>
        </InfiniteScroll>
      ) : !chatList.length && isLoading ? (
        <li className="absolute top-1/2 left-1/2 m-auto flex h-[48px] flex-shrink-0 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <DotLoader color="#C7EF83" size={32} />
        </li>
      ) : null}
    </ul>
  );
}
