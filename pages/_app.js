import "../styles/globals.css";
import { SWRConfig } from "swr";
import { SessionProvider } from "next-auth/react";
import NextNProgress from "nextjs-progressbar";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import useSocketStore from "../store/useSocketStore";
import { UserSocketInitializer } from "../components/Misc";
import { io } from "socket.io-client";

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
  const { setSocket } = useSocketStore();
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
  );
}
