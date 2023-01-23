import { Search, ArrowLeft } from "@carbon/icons-react";
import { CircleButton } from "../Buttons";
import { useState } from "react";
import { useRouter } from "next/router";

export default function SearchBox({ className, onClose }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className={className}>
      <div className="flex h-full items-center gap-2 bg-white">
        <div className="lg:hidden">
          <CircleButton icon={<ArrowLeft size={24} />} onClick={onClose} />
        </div>
        <div className="flex w-full overflow-hidden rounded-full border border-gray-100 p-2 shadow-md">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border-none px-2 text-[15px] placeholder-[#818181] outline-none focus:border-none focus:outline-none
            lg:px-4"
            placeholder="Search in eBarterYan"
          ></input>
          <button
            className="flex-shrink-0 rounded-full bg-green-500 p-1 text-white lg:p-2"
            onClick={() => {
              router.push(
                `/search?${new URLSearchParams({
                  search_query: searchQuery,
                }).toString()}`
              );
              setSearchQuery("");
            }}
          >
            <Search size={16} className="block" />
          </button>
        </div>
      </div>
    </div>
  );
}
