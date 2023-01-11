export default function BadgedIcon({ hasBadge = false, children, count = 0 }) {
  return (
    <div className="relative">
      {hasBadge && (
        <span
          className={`absolute top-[-14%] right-[-16%] ${
            count
              ? "top-[-16%] min-h-[16px] min-w-[18px] text-white"
              : "h-[14px] w-[14px]"
          } rounded-full border-2 border-white bg-info-500
        text-center text-[10px] font-medium group-hover:border-[#f1f1f1]`}
        >
          {count > 0 ? count : null}
        </span>
      )}
      {children}
    </div>
  );
}
