import { useSession } from "next-auth/react";
import usePaginate from "../../lib/hooks/usePaginate";
import useMessagesStore from "../../store/useMessagesStore";
import useSocketStore from "../../store/useSocketStore";
import ChatBubble from "./ChatBubble";
import { DotLoader } from "react-spinners";
// import InfiniteScroll from "react-infinite-scroller";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useRef } from "react";

export default function ChatContainer() {
  const chatsContainer = useRef(null);
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

  //effects
  useEffect(() => {
    if (chats.length) {
      setChatList(chats.reverse());
      // chatsContainer?.current?.scrollTo(
      //   0,
      //   chatsContainer?.current?.scrollHeight
      // );
    }
  }, [chats, setChatList]);

  // useEffect(() => scrollToEnd(), [chatList]);

  useEffect(() => {
    if (socket) {
      socket.on("message-receive", (chat) => {
        if (conversation && conversation._id == chat.conversation) {
          setChatList([...chatList, chat]);
        }
      });

      socket.on("chat-sent", (id) => {
        setChatList(
          chatList.map((chat) => {
            if (chat?.tempId == id) {
              return { ...chat, sent: true };
            }
            return chat;
          })
        );
      });

      return () => {
        socket.off("message-receive");
        socket.off("chat-sent");
      };
    }
  }, [socket, chatList, setChatList, conversation]);

  const chatBubbles = chatList.map((message, index) => {
    let isFromUser = message.sender.id == session?.user?.id ? true : false;
    if (index + 1 <= chatList.length - 1) {
      if (
        message.sender.id == chatList[index + 1].sender.id ||
        message.sender._id == chatList[index + 1].sender._id
      ) {
        return (
          <ChatBubble
            key={message?._id || message?.tempId}
            isFromUser={isFromUser}
            consecutive={true}
            images={message.images}
            offer={message?.offer}
            text={message.body}
            type={message.type}
            sent={message?.sent}
          />
        );
      } else {
        return (
          <ChatBubble
            key={message?._id || message?.tempId}
            isFromUser={isFromUser}
            consecutive={false}
            userPic={message.sender.image.url}
            images={message.images}
            offer={message?.offer}
            text={message.body}
            type={message.type}
            sent={message?.sent}
          />
        );
      }
    } else {
      return (
        <ChatBubble
          key={message?._id || message?.tempId}
          isFromUser={isFromUser}
          consecutive={false}
          images={message.images}
          offer={message?.offer}
          text={message.body}
          type={message.type}
          userPic={message.sender.image.url}
          sent={message?.sent}
        />
      );
    }
  });

  function scrollToEnd() {
    messagesEnd.current.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <ul
      id="chatsContainer"
      className="custom-scrollbar relative flex h-full w-full flex-col-reverse overflow-auto p-4"
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
      ) : (
        <li className="absolute top-1/2 left-1/2 m-auto flex h-[48px] flex-shrink-0 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <DotLoader color="#C7EF83" size={32} />
        </li>
      )}
    </ul>
  );
}
