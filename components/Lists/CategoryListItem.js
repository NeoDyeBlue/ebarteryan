import Link from "next/link";
import { useRouter } from "next/router";

export default function CategoryListItem({ to, name, aka }) {
  const router = useRouter();
  const currentRoute = router.asPath;
  const { category } = router.query;
  return (
    <li>
      <Link href={to}>
        <a
          className={`
          ${
            currentRoute == to ||
            category?.toLowerCase().split("+").join(" ") ==
              name.toLowerCase() ||
            (aka?.length && aka.includes(currentRoute))
              ? "text-black-light before:bg-green-500"
              : "hover:text-black-light hover:before:bg-gray-300"
          }
            relative flex h-full w-full items-center justify-center whitespace-nowrap 
            text-center font-display text-sm font-medium capitalize text-gray-300
            before:absolute before:bottom-0 before:block before:h-[4px] before:w-3/4 before:rounded-full before:transition-colors`}
        >
          {name}
        </a>
      </Link>
    </li>
  );
}
