import { Search, ArrowLeft } from "@carbon/icons-react";

export default function SearchBox({ className }) {
  return (
    <div className={className}>
      <div className="flex items-center h-full gap-2 bg-white">
        <button className="cursor-pointer flex items-center justify-center lg:hidden">
          <ArrowLeft size={24} />
        </button>
        <div className="w-full flex border border-gray-100 rounded-full p-2 overflow-hidden lg:shadow-md">
          <input
            className="w-full outline-none border-none focus:border-none focus:outline-none px-4 text-[15px]
            placeholder-[#818181]"
            placeholder="Search in eBarterYan"
          ></input>
          <button className="bg-green rounded-full text-white p-1 lg:p-2">
            <Search size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
