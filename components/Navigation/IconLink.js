import Link from "next/link";
import { useRouter } from "next/router";

export default function IconLink({ children, to, aka }) {
  const router = useRouter();
  const currentRoute = router.asPath;
  return (
    <Link href={to}>
      <a
        className={`flex h-[40px] w-[40px] items-center
        justify-center rounded-full ${
          currentRoute == to || (aka?.length && aka.includes(currentRoute))
            ? "bg-gray-100/30"
            : "hover:bg-gray-100/30"
        }`}
      >
        {children}
      </a>
    </Link>
  );
}
