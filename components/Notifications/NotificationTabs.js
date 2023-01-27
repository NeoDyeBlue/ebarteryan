import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import NotificationList from "./NotificationList";

export default function NotificationTabs({
  useParentScroll = false,
  forPage = false,
}) {
  return (
    <div className="w-full" onClick={(e) => e.stopPropagation()}>
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
            <NotificationList
              useParentScroll={useParentScroll}
              forPage={forPage}
              scrollableTargetId={"notificationsPopup"}
            />
          </TabPanel>
          <TabPanel>
            <NotificationList
              useParentScroll={useParentScroll}
              forPage={forPage}
              scrollableTargetId={"notificationsPopup"}
              unread
            />
          </TabPanel>
        </div>
      </Tabs>
    </div>
  );
}
