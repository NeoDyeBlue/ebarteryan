import Link from "next/link";
import { useRouter } from "next/router";

export default function IconLink({ children, to }) {
  const router = useRouter();
  const currentRoute = router.asPath;
  return (
    <Link href={to}>
      <a
        className={`flex items-center justify-center rounded-full
        p-3 ${currentRoute == to ? "bg-gray-100/30" : "hover:bg-gray-100/30"}`}
      >
        {children}
      </a>
    </Link>
  );
}
