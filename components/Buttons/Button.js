export default function Button({
  secondary,
  underlined,
  children,
  onClick,
  disabled,
  autoWidth,
  type,
}) {
  return (
    <button
      type={type ? type : "button"}
      onClick={onClick}
      disabled={disabled}
      className={`${autoWidth ? "w-auto" : "w-full"} ${
        secondary && !underlined
          ? "border border-black-light bg-white text-black-light hover:shadow-md"
          : ""
      } ${
        underlined && !secondary
          ? "border border-gray-100 bg-white text-black-light underline hover:shadow-md"
          : "no-underline"
      } ${
        !underlined && !secondary
          ? "bg-green-500 text-white hover:bg-green-600"
          : ""
      } flex w-full items-center justify-center gap-1 overflow-hidden text-ellipsis
        whitespace-nowrap rounded-[10px] px-4 py-3 text-center font-display text-[15px] font-medium
        disabled:cursor-not-allowed disabled:opacity-50
    `}
    >
      {children}
    </button>
  );
}
