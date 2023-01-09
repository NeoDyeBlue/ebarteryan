import MessageListItem from "./MessageListItem";
import MessageSearchBox from "./MessageSearchBox";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ConvoItemSkeleton } from "../Loaders";
import usePaginate from "../../lib/hooks/usePaginate";
import InfiniteScroll from "react-infinite-scroller";
import useMessagesStore from "../../store/useMessagesStore";
import useSocketStore from "../../store/useSocketStore";

export default function MessageList({ isForPage = false }) {
  const {
    setMessageList,
    messageList,
    setConversation,
    conversation,
    setIsPageConversationOpen,
  } = useMessagesStore();
  const { socket } = useSocketStore();
  const { data: session } = useSession();
  const [searchValue, setSearchValue] = useState("");

  const {
    data: conversations,
    isLoading,
    isEndReached,
    setSize,
    size,
    mutate,
    isValidating,
    cancel,
  } = usePaginate("/api/messages", 10, { search: searchValue });

  //effects
  useEffect(() => {
    if (conversations || conversations.length) {
      setMessageList(conversations);
    }
  }, [conversations, setMessageList]);

  useEffect(() => {
    if (socket) {
      socket.on("update-convo-list", (updatedConvo) => {
        setMessageList([
          updatedConvo,
          ...messageList.filter((convo) => convo._id != updatedConvo._id),
        ]);
        socket.emit("check-has-unread-convo", session && session.user.id);
      });

      return () => socket.off("update-convo-list");
    }
  }, [socket, setMessageList, messageList, session]);

  useEffect(() => {
    cancel();
    mutate();
  }, [searchValue]);

  const conversationItems =
    messageList.length &&
    messageList.map((message) => {
      let subtitle;
      let latestChatSender = "You";

      const recipient = message?.members?.find(
        (member) => member.user._id !== (session && session.user.id)
      );
      const sender = message?.members?.find(
        (member) => member.user._id == (session && session.user.id)
      );

      if (message.latestChat.sender !== (session && session.user.id)) {
        latestChatSender = recipient.user.firstName;
      }

      if (
        message.latestChat.type == "text" ||
        message.latestChat.type == "mixed" ||
        message.latestChat.type == "offer"
      ) {
        subtitle = `${latestChatSender}: ${message.latestChat.body}`;
      } else if (message.latestChat.type == "image") {
        subtitle = `${latestChatSender}: sent a photo`;
      }
      return (
        <MessageListItem
          key={message._id}
          convoId={message._id}
          onClick={() => joinConversation(message)}
          image={recipient.user.image.url}
          recipient={recipient}
          subtitle={subtitle}
          read={sender.read}
        />
      );
    });

  function joinConversation(room) {
    if (conversation?._id !== room._id) {
      socket.emit("join-conversation", {
        newRoom: room._id,
        oldRoom: conversation?._id,
      });
      setConversation(room);
    }
    if (isForPage) {
      setIsPageConversationOpen(true);
    }
  }

  function handleSearchValueChange(event) {
    setSearchValue(event.target.value);
  }

  return (
    <div className="h-full overflow-hidden">
      <div className="mb-4 px-4">
        <MessageSearchBox
          value={searchValue}
          onChange={handleSearchValueChange}
        />
      </div>
      <div className="h-full px-2">
        <InfiniteScroll
          element="ul"
          className="custom-scrollbar flex h-full w-full flex-col gap-2 overflow-y-auto"
          pageStart={size}
          loadMore={() => {
            if (!isLoading) {
              setSize(size + 1);
            }
          }}
          hasMore={!isEndReached}
          loader={[...Array(4)].map((_, i) => (
            <ConvoItemSkeleton key={i} />
          ))}
          useWindow={false}
        >
          {(!messageList.length && !isEndReached && isLoading) || isValidating
            ? [...Array(8)].map((_, i) => <ConvoItemSkeleton key={i} />)
            : conversationItems.length
            ? conversationItems
            : null}
        </InfiniteScroll>
      </div>
    </div>
  );
}
