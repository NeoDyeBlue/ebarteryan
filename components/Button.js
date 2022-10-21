export default function Button({
  secondary,
  underlined,
  children,
  onClick,
  disabled,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
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
      } flex disabled:opacity-50 w-full items-center justify-center gap-1 overflow-hidden
        text-ellipsis whitespace-nowrap rounded-[10px] px-4 py-3 text-center font-display text-[15px] font-medium
    `}
    >
      {children}
    </button>
  );
}
