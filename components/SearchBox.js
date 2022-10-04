import { Search, ArrowLeft } from "@carbon/icons-react";

export default function SearchBox({ className }) {
  return (
    <div className={className}>
      <div className="flex h-full items-center gap-2 bg-white">
        <button className="flex cursor-pointer items-center justify-center lg:hidden">
          <ArrowLeft size={24} />
        </button>
        <div className="flex w-full overflow-hidden rounded-full border border-gray-100 p-2 lg:shadow-md">
          <input
            className="w-full border-none px-4 text-[15px] placeholder-[#818181] outline-none focus:border-none
            focus:outline-none"
            placeholder="Search in eBarterYan"
          ></input>
          <button className="rounded-full bg-green-500 p-1 text-white lg:p-2">
            <Search size={16} className="block" />
          </button>
        </div>
      </div>
    </div>
  );
}
