import MessageListItem from "./MessageListItem";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { ConvoItemSkeleton } from "../Loaders";
import usePaginate from "../../lib/hooks/usePaginate";
import InfiniteScroll from "react-infinite-scroller";
import useMessagesStore from "../../store/useMessagesStore";

export default function MessageList({ children }) {
  const { setMessageList, messageList, setConversation } = useMessagesStore();
  const { data: session, status } = useSession();

  const {
    data: conversations,
    isLoading,
    isEndReached,
    error,
    setSize,
    size,
  } = usePaginate("/api/messages", 10);

  useEffect(() => {
    if (conversations.length) {
      setMessageList(conversations);
    }
  }, [conversations, setMessageList]);

  const conversationItems =
    messageList.length &&
    messageList.map((message) => {
      let subtitle;
      let latestChatSender = "You";
      const recipient = message?.members?.find(
        (member) => member._id !== (session && session.user.id)
      );
      if (message.latestChat.sender !== (session && session.user.id)) {
        latestChatSender = recipient.firstName;
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
          onClick={() => setConversation(message)}
          image={recipient.image.url}
          recipient={recipient}
          subtitle={subtitle}
        />
      );
    });

  return (
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
        {!messageList.length && !isEndReached && isLoading
          ? [...Array(8)].map((_, i) => <ConvoItemSkeleton key={i} />)
          : conversationItems}
      </InfiniteScroll>
    </div>
  );
}
