export default function KebabMenuItem({ children }) {
  return (
    <li
      className="flex cursor-pointer flex-row items-center
    gap-2 rounded-[10px] p-2 hover:bg-gray-100/30"
    >
      {children}
    </li>
  );
}
