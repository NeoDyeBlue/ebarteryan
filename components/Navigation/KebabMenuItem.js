export default function KebabMenuItem({ children, onClick }) {
  function handleClick(event) {
    event.stopPropagation();
    onClick();
  }
  return (
    <li
      onClick={handleClick}
      className="flex cursor-pointer flex-row items-center
    gap-2 rounded-[10px] p-2 hover:bg-gray-100/30"
    >
      {children}
    </li>
  );
}
