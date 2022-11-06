import { Logo } from "../Icons";
import { Add } from "@carbon/icons-react";
import Link from "next/link";

export default function CreationNavbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-b-gray-100 bg-white">
      <div className="container relative mx-auto flex items-center justify-start gap-4 py-4 lg:py-3">
        <button
          className="flex h-[36px] w-[36px] rotate-[135deg] items-center
        justify-center rounded-full border border-black-light text-black-light"
        >
          <Add size={32} />
        </button>
        <Link href="/">
          <a className="flex items-center gap-2">
            <Logo size={36} />
            <p className="hidden font-display text-xl font-semibold text-green-500 md:block md:text-2xl">
              eBarterYan
            </p>
          </a>
        </Link>
      </div>
    </nav>
  );
}
