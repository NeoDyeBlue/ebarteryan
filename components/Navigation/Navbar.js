import Link from "next/link";
import Logo from "../Icons/Logo";
import Image from "next/image";
import { Notification, Bookmark, ArrowsHorizontal } from "@carbon/icons-react";
import BadgedIcon from "../Icons/BadgedIcon";
import SearchBox from "../SearchBox";
import { useState } from "react";
import { Search } from "@carbon/icons-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-b-gray-100 bg-white">
      <div className="container relative mx-auto flex items-center justify-between py-4 lg:py-3">
        <Link href="/">
          <a className="flex items-center gap-2">
            <Logo />
            <p className="font-display text-xl font-semibold text-green md:text-2xl">
              eBarterYan
            </p>
          </a>
        </Link>
        <SearchBox className="container absolute top-0 left-0 z-10 mx-auto hidden h-full w-full max-w-[500px] px-4 lg:relative lg:block" />
        <div className="flex items-center gap-4 md:gap-10">
          <ul className="hidden items-center gap-7 md:flex">
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
          </ul>
          <button className="flex cursor-pointer items-center justify-center md:hidden">
            <Search size={24} />
          </button>
          <div className="relative h-6 w-6 overflow-hidden rounded-full">
            <Image
              src="https://res.cloudinary.com/dppgyhery/image/upload/v1639759887/idiary/users/1005/xoyowlqk13x4znkcu63p.jpg"
              layout="fill"
              // objectFit="cover"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
