import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import NotificationList from "./NotificationList";
import NotificationListItem from "./NotificationListtem";
import Link from "next/link";

export default function NotificationTabs() {
  return (
    <div className="w-full">
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
