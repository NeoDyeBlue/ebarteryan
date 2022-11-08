import "../styles/globals.css";
import { SWRConfig } from "swr";
import { SessionProvider } from "next-auth/react";

/**
 * different _app.js for next-auth useSession()
 * @see {@link https://brockherion.hashnode.dev/creating-per-page-layouts-with-nextjs-typescript-trcp-and-nextauth}
 */

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
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
        {layout}
      </SWRConfig>
    </SessionProvider>
  );
}
