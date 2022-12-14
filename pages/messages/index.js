import { NavLayout } from "../../components/Layouts";
import Head from "next/head";
import {
  Conversation,
  MessageList,
  MessageListItem,
  MessageSearchBox,
} from "../../components/Messages";
import { OverflowMenuVertical } from "@carbon/icons-react";
import { useRouter } from "next/router";
import useUiSizesStore from "../../store/useUiSizesStore";
import { useMemo } from "react";

export default function Messages() {
  const router = useRouter();
  const { conversation } = router.query;

  const { navbarHeight } = useUiSizesStore();

  return (
    <div
      className="flex h-full w-full"
      style={{ height: `calc(100vh - ${navbarHeight}px)` }}
    >
      <Head>
        <title>Messages | eBarterYan</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container relative mx-auto flex h-full">
        {/* message list */}
        <div className="relative flex w-full flex-col gap-4 border-gray-100 py-4 md:max-w-[320px] md:border-x">
          <div className="flex justify-between gap-4 md:px-4">
            <h1 className="text-2xl font-semibold">Messages</h1>
            <button>
              <OverflowMenuVertical size={24} />
            </button>
          </div>
          <div className="md:px-4">
            <MessageSearchBox />
          </div>
          <div className="custom-scrollbar overflow-y-auto overflow-x-hidden md:px-4">
            <MessageList>
              <MessageListItem
                photo="https://res.cloudinary.com/dppgyhery/image/upload/v1639759887/idiary/users/1005/xoyowlqk13x4znkcu63p.jpg"
                sender="Other User"
                subtitle="Other: Good work!"
              />
              <MessageListItem
                photo="https://res.cloudinary.com/dppgyhery/image/upload/v1639759887/idiary/users/1005/xoyowlqk13x4znkcu63p.jpg"
                sender="OtherLong UserName"
                subtitle="Other: Good work!"
                unread={true}
              />
              <MessageListItem
                photo="https://res.cloudinary.com/dppgyhery/image/upload/v1639759887/idiary/users/1005/xoyowlqk13x4znkcu63p.jpg"
                sender="Other User"
                subtitle="Other: Good work!"
              />
            </MessageList>
          </div>
        </div>
        {/* convo */}
        <div className="fixed top-0 left-0 z-50 h-full w-full border-gray-100 bg-white md:relative md:z-0 md:border-r">
          <Conversation />
        </div>
      </div>
    </div>
  );
}

Messages.getLayout = function getLayout(page) {
  return (
    <NavLayout noFooter={true} noStickyNavbar={true}>
      {page}
    </NavLayout>
  );
};
