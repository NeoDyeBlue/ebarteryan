import Link from "next/link";
import { Logo, BadgedIcon } from "../Icons";
import Image from "next/image";
import {
  Notification,
  Bookmark,
  ArrowsHorizontal,
  Home,
  UserAvatar,
} from "@carbon/icons-react";
import { SearchBox } from "../Inputs";
import { useState, useRef, useEffect } from "react";
import { Search } from "@carbon/icons-react";
import { useRouter } from "next/router";
import { NotificationsPopup } from "../Popups";
import useOnClickOutside from "../../lib/hooks/useOnClickOutside";
import useUiSizesStore from "../../store/useUiSizesStore";
import { useSession } from "next-auth/react";
import ProfileMenu from "./ProfileMenu";

export default function Navbar({ sticky }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notificationsPopupRef = useRef(null);
  const profileMenuRef = useRef(null);
  const navbarRef = useRef(null);
  const router = useRouter();
  const currentRoute = router.asPath;
  const { setNavbarHeight } = useUiSizesStore();
  const { data: session, status } = useSession();

  useOnClickOutside(notificationsPopupRef, hideNotificationsPopup);
  useOnClickOutside(profileMenuRef, hideProfileMenu);

  useEffect(() => {
    function handleResize() {
      setNavbarHeight(navbarRef.current?.getBoundingClientRect().height);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function showNotificationsPopup() {
    if (currentRoute != "/notifications") {
      setShowNotifications((prev) => !prev);
    }
  }

  function hideNotificationsPopup() {
    setShowNotifications(false);
  }

  function showProfileMenu() {
    setShowProfile((prev) => !prev);
  }

  function hideProfileMenu() {
    setShowProfile(false);
  }

  return (
    <nav
      ref={navbarRef}
      className={`${
        sticky ? "sticky" : "relative"
      } top-0 z-50 w-full border-b border-b-gray-100 bg-white`}
    >
      <div className="container relative mx-auto flex items-center justify-between py-4 lg:py-3">
        <Link href="/">
          <a className="flex items-center gap-2">
            <Logo responsive={true} />
            <p className="font-display text-xl font-semibold text-green-500 md:text-2xl">
              eBarterYan
            </p>
          </a>
        </Link>
        <SearchBox className="container absolute top-0 left-0 z-10 mx-auto hidden h-full w-full max-w-[500px] px-4 lg:relative lg:block" />
        <div className="relative flex items-center gap-4 md:gap-7">
          <ul className="hidden items-center gap-7 md:flex">
            <li>
              <Link href="/">
                <a className={`${currentRoute == "/" ? "text-green-500" : ""}`}>
                  <BadgedIcon>
                    <Home size={24} />
                  </BadgedIcon>
                </a>
              </Link>
            </li>
            <li>
              <Link href="/offers">
                <a
                  className={`${
                    currentRoute == "/offers" ? "text-green-500" : ""
                  }`}
                >
                  <BadgedIcon hasBadge={true}>
                    <ArrowsHorizontal size={24} />
                  </BadgedIcon>
                </a>
              </Link>
            </li>
            <li
              className="relative"
              ref={notificationsPopupRef}
              onClick={showNotificationsPopup}
            >
              <button
                className={`${
                  showNotifications || currentRoute == "/notifications"
                    ? "text-green-500"
                    : ""
                }`}
              >
                <BadgedIcon hasBadge={true}>
                  <Notification size={24} />
                </BadgedIcon>
              </button>
              {showNotifications && <NotificationsPopup />}
            </li>
            <li>
              <Link href="/saved">
                <a
                  className={`${
                    currentRoute == "/saved" ? "text-green-500" : ""
                  }`}
                >
                  <BadgedIcon hasBadge={true}>
                    <Bookmark size={24} />
                  </BadgedIcon>
                </a>
              </Link>
            </li>
          </ul>
          <button className="flex cursor-pointer items-center justify-center md:hidden">
            <Search size={24} />
          </button>
          <div
            className="relative"
            ref={profileMenuRef}
            onClick={showProfileMenu}
          >
            <button className="relative h-[24px] w-[24px] overflow-hidden rounded-full">
              {session && status == "authenticated" ? (
                <Image
                  src={session && session.user.image}
                  layout="fill"
                  // objectFit="cover"
                />
              ) : (
                <UserAvatar size={24} />
              )}
            </button>
            {showProfile && <ProfileMenu />}
          </div>
        </div>
      </div>
    </nav>
  );
}
