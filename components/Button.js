export default function Button({ secondary, underlined, children }) {
  return (
    <button
      className={`
      ${
        secondary && !underlined
          ? "bg-white border border-black-light text-black-light"
          : ""
      } ${
        underlined && !secondary
          ? "underline bg-white border border-gray-100 text-black-light"
          : "no-underline"
      } ${
        !underlined && !secondary ? "bg-green text-white" : ""
      } font-display text-[15px] font-medium text-center rounded-[10px] 
        px-4 py-3 flex items-center justify-center gap-1 w-full text-ellipsis whitespace-nowrap
    `}
    >
      {children}
    </button>
  );
}
