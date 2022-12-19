import Head from "next/head";
import { NavLayout } from "../components/Layouts";
import { NotificationTabs } from "../components/Notifications";

export default function Notifications() {
  return (
    <div className="w-full">
      <Head>
        <title>Notifications | eBarterYan</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto flex h-screen w-full max-w-[520px] flex-col py-6">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <NotificationTabs />
      </div>
    </div>
  );
}

Notifications.getLayout = function getLayout(page) {
  return <NavLayout>{page}</NavLayout>;
};
