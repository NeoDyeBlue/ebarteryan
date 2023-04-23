export default function Button({
  secondary,
  underlined,
  children,
  onClick,
  disabled = false,
  autoWidth,
  type,
  small,
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
      } ${
        small ? "px-3 py-2" : "px-4 py-3"
      } flex w-full items-center justify-center gap-1 overflow-hidden text-ellipsis
        whitespace-nowrap rounded-full text-center font-display font-medium
        disabled:cursor-not-allowed disabled:opacity-60
    `}
    >
      {children}
    </button>
  );
}
