import Link from "next/link";

export default function LinkButton({
  secondary,
  underlined,
  children,
  link,
  autoWidth,
}) {
  return (
    <Link href={link}>
      <a
        className={`${autoWidth ? "w-auto" : "w-full"} ${
          secondary && !underlined
            ? "border border-black-light bg-white text-black-light hover:shadow-md"
            : ""
        } ${
          underlined && !secondary
            ? "border border-gray-100 bg-white text-black-light underline hover:shadow-md"
            : "no-underline"
        } ${
          !underlined && !secondary
            ? "bg-green-500 text-white hover:bg-green-600"
            : ""
        } flex w-full items-center justify-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap
          rounded-[10px] px-4 py-3 text-center font-display text-[15px] font-medium disabled:opacity-50
      `}
      >
        {children}
      </a>
    </Link>
  );
}
