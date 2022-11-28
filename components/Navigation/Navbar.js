import Link from "next/link";
import { Logo, BadgedIcon } from "../Icons";
import Image from "next/image";
import {
  Notification,
  Bookmark,
  ArrowsHorizontal,
  Home,
  User,
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
import IconLink from "./IconLink";

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
  }, [setNavbarHeight]);

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
            <Logo size={36} />
            <p className="font-display text-xl font-semibold text-green-500 md:text-2xl">
              eBarterYan
            </p>
          </a>
        </Link>
        <SearchBox className="container absolute top-0 left-0 z-10 mx-auto hidden h-full w-full max-w-[500px] px-4 lg:relative lg:block" />
        <div className="relative flex items-center gap-3">
          <ul className="hidden items-center gap-2 md:flex">
            <li>
              <IconLink to="/" aka={["/items"]}>
                <Home size={24} />
              </IconLink>
            </li>
            {session && session.user.verified && status == "authenticated" ? (
              <>
                <li>
                  <IconLink to="/offers">
                    <BadgedIcon hasBadge={true}>
                      <ArrowsHorizontal size={24} />
                    </BadgedIcon>
                  </IconLink>
                </li>
                <li
                  className="relative"
                  ref={notificationsPopupRef}
                  onClick={showNotificationsPopup}
                >
                  <button
                    className={`flex h-[40px] w-[40px] items-center justify-center rounded-full ${
                      showNotifications || currentRoute == "/notifications"
                        ? "bg-gray-100/30"
                        : "hover:bg-gray-100/30"
                    }`}
                  >
                    <BadgedIcon hasBadge={true}>
                      <Notification size={24} />
                    </BadgedIcon>
                  </button>
                  {showNotifications && <NotificationsPopup />}
                </li>
                <li>
                  <IconLink to="/saved">
                    <BadgedIcon hasBadge={true}>
                      <Bookmark size={24} />
                    </BadgedIcon>
                  </IconLink>
                </li>
              </>
            ) : null}
          </ul>
          <button className="flex cursor-pointer items-center justify-center md:hidden">
            <Search size={24} />
          </button>
          <div
            className="relative flex items-center justify-center"
            ref={profileMenuRef}
            onClick={showProfileMenu}
          >
            {session && status == "authenticated" ? (
              <button
                className="relative h-[40px] w-[40px] overflow-hidden rounded-full 
              hover:shadow-md"
              >
                <Image
                  src={session && session.user.image}
                  layout="fill"
                  alt="user image"
                  // objectFit="cover"
                />
              </button>
            ) : (
              <button
                className={`flex h-[40px] w-[40px] items-center justify-center rounded-full border border-gray-100 text-center 
                ${showProfile ? "shadow-md" : "hover:shadow-md"}`}
              >
                <User size={24} />
              </button>
            )}
            {showProfile && <ProfileMenu />}
          </div>
        </div>
      </div>
    </nav>
  );
}
