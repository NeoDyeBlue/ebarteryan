import Link from "next/link";
import BadgedIcon from "../Icons/BadgedIcon";
import {
  Notification,
  Bookmark,
  ArrowsHorizontal,
  Chat,
  Home,
} from "@carbon/icons-react";

export default function MobileNavbar({ className }) {
  return (
    <nav className={className}>
      <ul className="flex items-center justify-between w-full">
        <li>
          <Link href="/">
            <a>
              <BadgedIcon>
                <Home size={24} />
              </BadgedIcon>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/">
            <a>
              <BadgedIcon hasBadge={true}>
                <ArrowsHorizontal size={24} />
              </BadgedIcon>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/">
            <a>
              <BadgedIcon hasBadge={true}>
                <Notification size={24} />
              </BadgedIcon>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/">
            <a>
              <BadgedIcon hasBadge={true}>
                <Bookmark size={24} />
              </BadgedIcon>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/">
            <a>
              <BadgedIcon hasBadge={true}>
                <Chat size={24} />
              </BadgedIcon>
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
