import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import NotificationList from "./NotificationList";

export default function NotificationTabs() {
  return (
    <div className="w-full">
      <Tabs className="flex flex-col">
        <TabList className="flex gap-4 px-4">
          <Tab className="tab" selectedClassName="tab-active">
            <p>All</p>
          </Tab>
          <Tab className="tab" selectedClassName="tab-active">
            <p>Unread</p>
          </Tab>
        </TabList>
        <div>
          <TabPanel>
            <NotificationList scrollableTargetId={"notificationsPopup"} />
          </TabPanel>
          <TabPanel>
            <NotificationList scrollableTargetId={"notificationsPopup"} />
          </TabPanel>
        </div>
      </Tabs>
    </div>
  );
}
