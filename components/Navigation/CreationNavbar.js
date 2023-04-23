import { Logo } from "../Icons";
import { Add } from "@carbon/icons-react";
import Link from "next/link";
import useCreationStore from "../../store/useUrlCallbackStore";
import { useMemo } from "react";

export default function CreationNavbar() {
  const { path, host } = useCreationStore();
  const onCloseUrl = useMemo(() => {
    if (
      window &&
      host == `${window.location.protocol}//${window.location.host}` &&
      path !== "/create"
    ) {
      return path;
    }
    return "/";
  }, [path, host]);
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-b-gray-100 bg-white">
      <div className="container relative mx-auto flex items-center justify-start gap-4 py-4 lg:py-3">
        <Link href={onCloseUrl}>
          <a
            className="flex h-[36px] w-[36px] items-center
        justify-center rounded-full border border-black-light text-black-light"
          >
            <Add size={32} className="rotate-[135deg]" />
          </a>
        </Link>
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
