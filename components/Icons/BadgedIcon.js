export default function BadgedIcon({ hasBadge, children }) {
  return (
    <div className="relative">
      {hasBadge && (
        <span className="absolute rounded-full bg-red text-center top-[-15%] right-[-20%] text-[10px] w-[14px] h-[14px] border-white border-2"></span>
      )}
      {children}
    </div>
  );
}
