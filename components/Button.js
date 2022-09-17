export default function Button({ secondary, underlined, children }) {
  return (
    <button
      className={`
      ${
        secondary
          ? "bg-white border border-gray-100 text-black-light"
          : "bg-green text-white"
      } ${
        underlined ? "underline" : "no-underline"
      } font-display text-[15px] font-medium text-center rounded-[10px] 
        px-4 py-3 flex items-center justify-center gap-2 w-full text-ellipsis whitespace-nowrap
    `}
    >
      {children}
    </button>
  );
}
