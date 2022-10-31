import Link from "next/link";
import { UserAvatar, Settings, Logout } from "@carbon/icons-react";
import { LinkButton } from "../Buttons";
import { signOut, useSession } from "next-auth/react";
import Marquee from "react-fast-marquee";

export default function ProfileMenu() {
  const { data: session, status } = useSession();
  return (
    <div
      className="absolute top-[calc(100%+1rem)] right-0 flex w-[150px] flex-col
     gap-2 rounded-[10px] border border-gray-100 bg-white px-4 pt-4 pb-2 shadow-lg"
    >
      {session && status == "authenticated" && (
        <>
          <div className="border-b border-b-gray-100 pb-4">
            <Marquee gradientWidth={8}>
              <p className="whitespace-nowrap px-4 font-display font-semibold">
                {session.user.firstName} {session.user.lastName}
              </p>
            </Marquee>
            {!session.user.verified && (
              <p className="text-xs text-gray-300">not verified</p>
            )}
          </div>
          <ul className="flex flex-col border-b border-gray-100 pb-2">
            <li>
              <Link href="/profile">
                <a
                  className="relative flex cursor-pointer items-center gap-2 whitespace-nowrap py-2
    before:absolute before:left-1/2 before:top-0 before:h-full before:w-[calc(100%+15%)]
    before:translate-x-[-50%] before:rounded-[10px] before:bg-transparent hover:before:bg-gray-100/30"
                >
                  <UserAvatar size={24} /> Your Profile
                </a>
              </Link>
            </li>
            <li>
              <Link href="/profile/edit">
                <a
                  className="relative flex cursor-pointer items-center gap-2 whitespace-nowrap py-2
    before:absolute before:left-1/2 before:top-0 before:h-full before:w-[calc(100%+15%)]
    before:translate-x-[-50%] before:rounded-[10px] before:bg-transparent hover:before:bg-gray-100/30"
                >
                  <Settings size={24} /> Settings
                </a>
              </Link>
            </li>
          </ul>
        </>
      )}
      <div className="flex flex-col gap-4">
        {!session && status == "unauthenticated" ? (
          <>
            <LinkButton secondary={true} link="/login">
              Login
            </LinkButton>
            <LinkButton link="/signup">Sign Up</LinkButton>
          </>
        ) : (
          <button
            className="relative flex cursor-pointer items-center gap-2 py-2 before:absolute
          before:left-1/2 before:top-0 before:z-10 before:h-full before:w-[calc(100%+15%)]
          before:translate-x-[-50%] before:rounded-[10px] before:bg-transparent hover:before:bg-gray-100/30"
            onClick={() => signOut()}
          >
            <Logout size={24} />
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
