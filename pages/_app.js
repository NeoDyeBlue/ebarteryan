import "../styles/globals.css";
import { SWRConfig } from "swr";
import { SessionProvider } from "next-auth/react";
import NextNProgress from "nextjs-progressbar";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import useSocketStore from "../store/useSocketStore";
import { UserSocketInitializer } from "../components/Misc";
import { io } from "socket.io-client";
import Script from "next/script";
import { toast } from "react-hot-toast";
import { WifiOff, Wifi } from "@carbon/icons-react";
import { useRouter } from "next/router";

const socket = io({
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

/**
 * different _app.js for next-auth useSession()
 * @see {@link https://brockherion.hashnode.dev/creating-per-page-layouts-with-nextjs-typescript-trcp-and-nextauth}
 */

const contextClass = {
  success: "bg-success-500",
  error: "bg-danger-500",
  info: "bg-info-500",
  warning: "bg-warning-500",
  default: "bg-green-500",
  dark: "bg-white font-gray-300",
};

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();
  const { setSocket } = useSocketStore();
  const [offlineToastId, setOfflineToastId] = useState("");
  useEffect(() => {
    function handleOfflineStatus() {
      toast.custom(
        (t) => {
          setOfflineToastId(t.id);
          return (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } pointer-events-auto flex w-full max-w-md rounded-lg bg-gray-400 text-white shadow-lg ring-1 ring-black ring-opacity-5`}
            >
              <div className="w-0 flex-1 p-4">
                <div className="flex items-start gap-4">
                  <WifiOff size={24} className="text-danger-500" />
                  <p>You have no internet connection</p>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => router.reload()}
                  className="text-indigo-600 hover:text-indigo-500 focus:ring-indigo-500 flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium focus:outline-none focus:ring-2"
                >
                  Refresh
                </button>
              </div>
            </div>
          );
        },
        { duration: Infinity }
      );
    }

    function handleOnlineStatus() {
      toast.dismiss(offlineToastId);
      toast.custom(
        (t) => {
          return (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } pointer-events-auto flex w-full max-w-md rounded-lg bg-gray-400 text-white shadow-lg ring-1 ring-black ring-opacity-5`}
            >
              <div className="w-0 flex-1 p-4">
                <div className="flex items-start gap-4">
                  <Wifi size={24} className="text-success-500" />
                  <p>Your internet connection was restored</p>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="text-indigo-600 hover:text-indigo-500 focus:ring-indigo-500 flex w-full items-center justify-center rounded-none rounded-r-lg border border-transparent p-4 text-sm font-medium focus:outline-none focus:ring-2"
                >
                  Close
                </button>
              </div>
            </div>
          );
        },
        { duration: Infinity }
      );
    }

    window.addEventListener("offline", handleOfflineStatus);
    window.addEventListener("online", handleOnlineStatus);

    return () => {
      window.removeEventListener("offline", handleOfflineStatus);
      window.removeEventListener("online", handleOnlineStatus);
    };
  }, [offlineToastId]);
  useEffect(() => {
    async function handleSocket() {
      fetch("/api/socket").then(() => {
        setSocket(socket);
      });

      //   const session = await getSession();
      //   if (session) {
      //     socket.emit("user:connect", session.user.id);
      //   }
      if (!socket.connected) {
        socket.connect();
      }

      return () => {
        socket.disconnect();
      };
    }
    console.log(socket);
    handleSocket();
  }, [setSocket]);
  const getLayout = Component.getLayout ?? ((page) => page);
  const layout = getLayout(<Component {...pageProps} />);
  return (
    <>
      <Script
        id="Adsense-id"
        async
        onError={(e) => {
          console.error("Ad Script failed to load", e);
        }}
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8971407658577008"
      />
      <SessionProvider session={session}>
        <SWRConfig
          value={{
            // refreshInterval: 3000,
            revalidateOnFocus: false,
            fetcher: (resource, init) =>
              fetch(resource, init).then((res) => res.json()),
          }}
        >
          <NextNProgress
            color="#85CB33"
            startPosition={0.3}
            stopDelayMs={200}
            height={3}
            showOnShallow={true}
            options={{ showSpinner: false, easing: "ease", speed: 500 }}
            toastClassName={({ type }) =>
              contextClass[type || "default"] +
              "relative flex p-1 min-h-10 rounded-full justify-between overflow-hidden cursor-pointer border border-green font-body"
            }
          />
          <Toaster
            position="bottom-center"
            containerStyle={{
              top: 40,
              left: 40,
              bottom: 40,
              right: 40,
            }}
            toastOptions={{
              duration: 5000,
              className:
                "min-w-[200px] bg-black font-body text-white rounded-[10px] shadow-md p-3",
              style: {
                background: "#000",
                color: "#fff",
              },
            }}
          />
          <UserSocketInitializer>{layout}</UserSocketInitializer>
        </SWRConfig>
      </SessionProvider>
    </>
  );
}
