import { Search } from "@carbon/icons-react";

export default function MessageSearchBox({ value, onChange }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-gray-100/30 px-3 py-2">
      <Search size={24} className="text-gray-200" />
      <input
        onChange={onChange}
        className="w-full bg-transparent placeholder:text-gray-200 focus:outline-none"
        name="messageSearch"
        value={value}
        placeholder="Search messages"
      ></input>
    </div>
  );
}
