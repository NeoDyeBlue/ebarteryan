import "../styles/globals.css";
import { SWRConfig } from "swr";

export default function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(
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
  );
}
