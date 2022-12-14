import { NavLayout } from "../components/Layouts";
import Head from "next/head";
import { DotLoader } from "react-spinners";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Checkmark, FaceDissatisfied, Email } from "@carbon/icons-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "../components/Icons";

const verifyFetcher = (url, args) =>
  fetch(`${url}?token=${args.token}`, { method: "PATCH" }).then((r) =>
    r.json()
  );

export default function Verify() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { token } = router.query;
  // const { data: verification, error } = useSWR(
  //   token ? ["/api/verify", { token }] : null,
  //   verifyFetcher
  // );

  const [verification, setVerification] = useState(null);

  useEffect(() => {
    async function verify() {
      const res = await fetch(`/api/verify?token=${token}`, {
        method: "PATCH",
      });
      const data = await res.json();
      setVerification(data);
    }
    verify();
  }, []);

  useEffect(() => {
    async function sessionUpdater() {
      if (verification) {
        if (verification.success && session && status == "authenticated") {
          fetch("/api/auth/session?update").then(() => router.push("/"));
        }
      }
    }
    sessionUpdater();
  }, [verification]);

  const isLoading =
    (!verification || status == "loading") && token ? true : false;
  const success =
    token && verification && verification.success && status !== "loading"
      ? true
      : false;

  return (
    <div className="h-screen w-full">
      <Head>
        <title>Verify | eBarterYan</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto flex h-full w-full flex-col items-center justify-center py-6">
        <Link href="/">
          <a className="flex items-center gap-2">
            <Logo size={36} />
            <p className="font-display text-xl font-semibold text-green-500 md:text-2xl">
              eBarterYan
            </p>
          </a>
        </Link>
        <div
          className="m-auto flex w-full max-w-[480px] flex-col items-center justify-center gap-6
        rounded-[10px] border border-gray-100 bg-white p-6 shadow-lg"
        >
          <span className="text-green-500">
            {!success && !isLoading && <FaceDissatisfied size={100} />}
            {isLoading && <Email size={100} />}
            {success && !isLoading && <Checkmark size={100} />}
          </span>
          <h1 className="text-4xl font-semibold">
            {!success && !isLoading && "Failed"}
            {isLoading && "Verifying..."}
            {success && !isLoading && "Verified"}
          </h1>
          {isLoading && (
            <div className="flex h-[48px] flex-shrink-0 items-center justify-center">
              <DotLoader color="#C7EF83" size={48} />
            </div>
          )}
          <p className="text-center">
            {!success && !isLoading && "invalid token"}
            {success && !isLoading && (
              <span>
                Setup successful! Redirecting to home page. Did not redirect?{" "}
                <Link href={"/"}>
                  <a className="font-display font-medium text-green-500 hover:underline">
                    Click here
                  </a>
                </Link>
              </span>
            )}
          </p>
        </div>
        <p className="mx-auto text-xs text-gray-400">
          ?? 2022 EBarterYan. All Rights Reserved
        </p>
      </div>
    </div>
  );
}

// Verify.getLayout = function getLayout(page) {
//   return <NavLayout>{page}</NavLayout>;
// };
