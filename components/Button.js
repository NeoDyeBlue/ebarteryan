export default function Button({ secondary, underlined, children }) {
  return (
    <button
      className={`
      ${
        secondary && !underlined
          ? "border border-black-light bg-white text-black-light"
          : ""
      } ${
        underlined && !secondary
          ? "border border-gray-100 bg-white text-black-light underline"
          : "no-underline"
      } ${
        !underlined && !secondary ? "bg-green-500 text-white" : ""
      } flex w-full items-center justify-center gap-1 
        text-ellipsis whitespace-nowrap rounded-[10px] px-4 py-3 text-center font-display text-[15px] font-medium
    `}
    >
      {children}
    </button>
  );
}
