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
          <IconLink to="/" aka={["/items"]}>
            <Home size={24} />
          </IconLink>
        </li>
        {session && status == "authenticated" && (
          <>
            <li>
              <IconLink to="/offers">
                <BadgedIcon hasBadge={false}>
                  <ArrowsHorizontal size={24} />
                </BadgedIcon>
              </IconLink>
            </li>
            <li>
              <IconLink to="/saved">
                <BadgedIcon hasBadge={false}>
                  <Bookmark size={24} />
                </BadgedIcon>
              </IconLink>
            </li>
            <li>
              <IconLink to="/notifications">
                <BadgedIcon hasBadge>
                  <Notification size={24} />
                </BadgedIcon>
              </IconLink>
            </li>
            <li>
              <IconLink to="/messages">
                <BadgedIcon hasBadge>
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
