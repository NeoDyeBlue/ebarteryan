import Link from "next/link";

export default function CategoryListItem({ to, name }) {
  return (
    <li>
      <Link href={to}>
        <a
          className="
            relative font-display font-medium text-sm capitalize text-gray-300 hover:text-black-light 
            before:block before:absolute before:w-full before:h-[3px] before:rounded-full hover:before:bg-gray-300
            before:bottom-0 h-full flex items-center justify-center text-center w-full whitespace-nowrap"
        >
          {name}
        </a>
      </Link>
    </li>
  );
}
