import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import NotificationList from "./NotificationList";
import NotificationListItem from "./NotificationListtem";
import Link from "next/link";

export default function NotificationTabs({ showAllLink }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Notifications</h1>
        {showAllLink && (
          <Link href={showAllLink}>
            <a
              className="rounded-[10px] px-2 py-1 font-display text-green-500
            hover:bg-gray-100/30"
            >
              See All
            </a>
          </Link>
        )}
      </div>
      <Tabs className="flex flex-col">
        <TabList className="flex gap-4">
          <Tab className="tab" selectedClassName="tab-active">
            <p>All</p>
          </Tab>
          <Tab className="tab" selectedClassName="tab-active">
            <p>Unread</p>
          </Tab>
        </TabList>
        <div>
          <TabPanel>
            <NotificationList>
              <NotificationListItem />
              <NotificationListItem unread={true} />
              <NotificationListItem />
              <NotificationListItem />
              <NotificationListItem />
              <NotificationListItem />
            </NotificationList>
          </TabPanel>
          <TabPanel>
            <NotificationList>
              <NotificationListItem unread={true} />
            </NotificationList>
          </TabPanel>
        </div>
      </Tabs>
    </div>
  );
}
