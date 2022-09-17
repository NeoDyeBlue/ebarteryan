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
    <nav className="w-full border-b border-b-gray-100 z-50 sticky top-0 bg-white">
      <div className="flex relative container mx-auto items-center justify-between py-4 lg:py-3">
        <Link href="/">
          <a className="flex items-center gap-2">
            <Logo />
            <p className="font-display font-semibold text-xl text-green md:text-2xl">
              eBarterYan
            </p>
          </a>
        </Link>
        <SearchBox className="hidden lg:block absolute w-full h-full top-0 left-0 px-4 container mx-auto lg:relative max-w-[500px] z-10" />
        <div className="flex items-center gap-4 md:gap-10">
          <ul className="hidden md:flex items-center gap-7">
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
          <button className="cursor-pointer flex items-center justify-center md:hidden">
            <Search size={24} />
          </button>
          <div className="relative overflow-hidden rounded-full w-6 h-6">
            <Image
              src="https://res.cloudinary.com/dppgyhery/image/upload/v1639759887/idiary/users/1005/xoyowlqk13x4znkcu63p.jpg"
              layout="fill"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
