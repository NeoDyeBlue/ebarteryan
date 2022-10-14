import { Search } from "@carbon/icons-react";

export default function MessageSearchBox({ value }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-gray-100/50 p-2">
      <Search size={24} className="text-gray-200" />
      <input
        className="w-full bg-transparent placeholder:text-gray-200 focus:outline-none"
        name="messageSearch"
        value={value}
        placeholder="Search messages"
      ></input>
    </div>
  );
}
