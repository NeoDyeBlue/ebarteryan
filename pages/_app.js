import "../styles/globals.css";
import { SWRConfig } from "swr";
import { SessionProvider } from "next-auth/react";

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(
    <SessionProvider session={session}>
      <SWRConfig
        value={{
          // refreshInterval: 3000,
          revalidateOnFocus: false,
          fetcher: (resource, init) =>
            fetch(resource, init).then((res) => res.json()),
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </SessionProvider>
  );
}
