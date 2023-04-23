import Link from "next/link";
import { useRouter } from "next/router";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

export default function IconLink({ children, to, tooltipMessage, id }) {
  const router = useRouter();
  const currentRoute = router.asPath;
  return (
    <>
      <Link href={to}>
        <a
          id={id}
          data-tooltip-content={tooltipMessage}
          className={`group flex h-[40px] w-[40px]
        items-center justify-center rounded-full ${
          currentRoute == to ? "bg-gray-100/30" : "hover:bg-gray-100/30"
        }`}
        >
          {children}
        </a>
      </Link>
      <Tooltip anchorId={id} className="font-sm font-body" />
    </>
  );
}
