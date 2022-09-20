import Button from "./Button";
import { Pen, Location } from "@carbon/icons-react";

export default function LocationBarterButtons({ className }) {
  return (
    <div
      className={
        className
          ? className
          : "lg:hidden container mx-auto flex flex-col p-4 gap-4 w-full"
      }
    >
      <Button>
        <Pen size={20} /> Make a Barter
      </Button>
      <Button underlined="true">
        <Location size={20} /> Pandi, Bulacan
      </Button>
    </div>
  );
}
