import Link from "next/link";
import { Warning } from "@carbon/icons-react";
import { signOut, useSession } from "next-auth/react";
import Marquee from "react-fast-marquee";
import { useRef, useState, useCallback } from "react";
import useSocketStore from "../../store/useSocketStore";

export default function ProfileMenu() {
  const { data: session, status } = useSession();
  const containerRef = useRef(null);
  const [isTextOverflowing, setIsTextOverflowing] = useState(false);
  const { socket } = useSocketStore();

  const textRef = useCallback((node) => {
    if (node !== null) {
      const container = containerRef.current;
      setIsTextOverflowing(node.offsetWidth > container.scrollWidth);
    }
  }, []);
  return (
    <div
      className="absolute top-[calc(100%+0.5rem)] right-0 flex w-[220px] flex-col
     rounded-[10px] border border-gray-100 bg-white pb-2 shadow-lg"
    >
      {session && status == "authenticated" && (
        <>
          <div className="mx-4 my-5" ref={containerRef}>
            <Marquee
              gradientWidth={isTextOverflowing ? 8 : 0}
              play={isTextOverflowing}
            >
              <p
                className={`whitespace-nowrap font-display font-semibold ${
                  isTextOverflowing ? "px-2" : "px-0"
                }`}
                ref={textRef}
              >
                {session.user.firstName} {session.user.lastName}
              </p>
            </Marquee>
            {!session.user.verified && (
              <p className="text-xs text-gray-300">
                <Warning size={12} /> Not verified |{" "}
                <Link href="/verification">
                  <a className="text-green-500">verify</a>
                </Link>
              </p>
            )}
          </div>
          <ul className="flex flex-col border-y border-gray-100 py-2">
            <li>
              <Link href="/profile">
                <a className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100/30">
                  Your Profile
                </a>
              </Link>
            </li>
            <li>
              <Link href="/profile/settings">
                <a className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100/30">
                  Settings
                </a>
              </Link>
            </li>
          </ul>
        </>
      )}
      <div className="flex flex-col gap-4">
        {!session && status == "unauthenticated" ? (
          <div className="flex flex-col pt-2">
            <Link href="/signup">
              <a className="flex items-center gap-2 px-4 py-3 font-display font-medium text-green-500 hover:bg-gray-100/30">
                Sign Up
              </a>
            </Link>
            <Link href="/login">
              <a className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100/30">
                Login
              </a>
            </Link>
          </div>
        ) : (
          <button
            className="mt-2 flex items-center gap-2 px-4 py-3 hover:bg-gray-100/30"
            onClick={() => {
              socket.disconnect();
              signOut();
            }}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
