import { NavLayout } from "../components/Layouts";
import Head from "next/head";
import { LoginForm } from "../components/Forms";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useLayoutEffect } from "react";

export default function Login() {
  // const { data: session, status } = useSession();
  // const router = useRouter();

  // useLayoutEffect(() => {
  //   if (session && status == "authenticated") {
  //     router.push("/");
  //     console.log(session, status);
  //   }
  // }, [session, status]);

  return (
    <div className="w-full">
      <Head>
        <title>Login | eBarterYan</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto flex py-6">
        <LoginForm />
      </div>
    </div>
  );
}

Login.getLayout = function getLayout(page) {
  return <NavLayout>{page}</NavLayout>;
};
