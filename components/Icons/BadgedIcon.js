export default function BadgedIcon({ hasBadge = false, children, count = 0 }) {
  return (
    <div className="relative">
      {hasBadge && (
        <span
          className={`absolute top-[-16%] ${
            count
              ? "left-[60%] min-h-[16px] min-w-[16px] px-1 leading-[16px] text-white"
              : "left-[70%] h-[12px] w-[12px] "
          } rounded-full bg-info-500 text-center text-[10px] font-medium`}
        >
          {count > 0 ? (count > 100 ? "99+" : count) : null}
        </span>
      )}
      {children}
    </div>
  );
}
