import Button from "./Button";
import { Pen, Location } from "@carbon/icons-react";
import Link from "next/link";

export default function LocationBarterButtons({ className }) {
  return (
    <div
      className={
        className
          ? className
          : "container mx-auto flex w-full flex-col gap-4 p-4 lg:hidden"
      }
    >
      <Link href="/create">
        <a
          className="flex w-full items-center justify-center gap-1 text-ellipsis whitespace-nowrap 
        rounded-[10px] bg-green-500 px-4 py-3 text-center font-display text-[15px] font-medium text-white"
        >
          <Pen size={20} /> Make a Barter
        </a>
      </Link>
      <Button underlined="true">
        <Location size={20} /> Pandi, Bulacan
      </Button>
    </div>
  );
}
