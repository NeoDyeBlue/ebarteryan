import NavLayout from "../components/Layouts/NavLayout";
import Head from "next/head";
import { Email } from "@carbon/icons-react";

export default function Verification() {
  return (
    <div className="w-full">
      <Head>
        <title>Verification | eBarterYan</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto flex min-h-[calc(100vh-70px-57.25px)] md:min-h-[calc(100vh-71.5px)]">
        <div
          className="m-auto flex max-w-[480px] flex-col items-center justify-center gap-6
        rounded-[10px] border border-gray-100 bg-white p-6 shadow-lg"
        >
          <Email size={100} className="text-green-500" />
          <h1 className="text-4xl font-semibold">Verification</h1>
          <p className="text-center">
            We've sent an email containing a verification link. Click the link
            to finish setting up your account.
          </p>
          <p>
            Did'nt receive it?{" "}
            <span className="font-display font-medium text-green-500 hover:underline">
              Resend
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

Verification.getLayout = function getLayout(page) {
  return <NavLayout>{page}</NavLayout>;
};
