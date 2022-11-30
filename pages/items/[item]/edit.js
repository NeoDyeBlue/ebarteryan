import Head from "next/head";
import { CreationLayout } from "../../../components/Layouts";
import { EditListingForm } from "../../../components/Forms";
import { useEffect } from "react";
import useUrlCallbackStore from "../../../store/useUrlCallbackStore";
import { getSession } from "next-auth/react";
import { getItem } from "../../../lib/controllers/item-controller";
import { ErrorScreen } from "../../../components/Misc";

export async function getServerSideProps(context) {
  const { params } = context;
  let url = "";
  let path = "/";
  let host =
    process.env.NODE_ENV == "production"
      ? process.env.PRODUCTION_URL
      : process.env.DEVELOPMENT_URL;
  let fromUser = false;
  let error = false;
  if (context.req.headers.referer) {
    url = new URL(context.req.headers.referer) || null;
    path = url.pathname;
    host = `${url.protocol}//${context.req.headers.host}`;
  }
  try {
    const item = await getItem(params.item);
    if (!item) {
      throw new Error();
    }
    const session = await getSession(context);
    if (session && session?.user?.verified) {
      fromUser = item?.user?._id == session?.user?.id;
      if (!fromUser) {
        throw new Error();
      }
    } else {
      if (!session) {
        return {
          redirect: {
            permanent: false,
            destination: "/login",
          },
          props: {},
        };
      } else if (session && !session?.user?.verified) {
        return {
          redirect: {
            permanent: false,
            destination: "/verification",
          },
          props: {},
        };
      }
    }
    return {
      props: {
        path,
        host,
        item: fromUser ? JSON.parse(JSON.stringify(item)) : null,
        error,
      },
    };
  } catch (error) {
    error = true;
    return {
      props: {
        path,
        host,
        item: null,
        error,
      },
    };
  }
}

export default function Edit({ path, host, item, error }) {
  const { setPath, setHost } = useUrlCallbackStore();
  useEffect(() => {
    setPath(path);
    setHost(host);
  }, [path, host, setPath, setHost]);

  if (error) {
    return (
      <div className="w-full">
        <Head>
          <title>Edit Item | eBarterYan</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <ErrorScreen />
      </div>
    );
  }

  return (
    <div className="w-full">
      <Head>
        <title>Edit Item | eBarterYan</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto">
        <EditListingForm item={item} />
      </div>
    </div>
  );
}
Edit.getLayout = function getLayout(page) {
  return <CreationLayout>{page}</CreationLayout>;
};
