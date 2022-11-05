import Link from "next/link";
import BadgedIcon from "../Icons/BadgedIcon";
import {
  Notification,
  Bookmark,
  ArrowsHorizontal,
  Chat,
  Home,
} from "@carbon/icons-react";
import IconLink from "./IconLink";
import { useSession } from "next-auth/react";

export default function MobileNavbar({ className }) {
  const { data: session, status } = useSession();
  return (
    <nav className={className}>
      <ul className="container mx-auto flex w-full items-center justify-between">
        <li
          className={`${session && status == "authenticated" ? "" : "mx-auto"}`}
        >
          <IconLink to="/">
            <BadgedIcon>
              <Home size={24} />
            </BadgedIcon>
          </IconLink>
        </li>
        {session && status == "authenticated" && (
          <>
            <li>
              <IconLink to="/offers">
                <BadgedIcon hasBadge={true}>
                  <ArrowsHorizontal size={24} />
                </BadgedIcon>
              </IconLink>
            </li>
            <li>
              <IconLink to="/notifications">
                <BadgedIcon hasBadge={true}>
                  <Notification size={24} />
                </BadgedIcon>
              </IconLink>
            </li>
            <li>
              <IconLink to="/saved">
                <BadgedIcon hasBadge={true}>
                  <Bookmark size={24} />
                </BadgedIcon>
              </IconLink>
            </li>
            <li>
              <IconLink to="/messages">
                <BadgedIcon hasBadge={true}>
                  <Chat size={24} />
                </BadgedIcon>
              </IconLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
