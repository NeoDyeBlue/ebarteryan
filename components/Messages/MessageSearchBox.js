import { Search } from "@carbon/icons-react";

export default function MessageSearchBox({ value }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-gray-100/50 py-1 px-4">
      <Search size={24} className="text-gray-200" />
      <input
        className="w-full bg-transparent py-2 placeholder:text-gray-200 focus:outline-none"
        name="messageSearch"
        value={value}
        placeholder="Search for messages"
      ></input>
    </div>
  );
}
