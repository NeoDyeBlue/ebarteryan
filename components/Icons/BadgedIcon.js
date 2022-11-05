export default function BadgedIcon({ hasBadge, children }) {
  return (
    <div className="relative">
      {hasBadge && (
        <span
          className="absolute top-[-10%] right-[-10%] h-[10px] w-[10px] rounded-full 
        bg-info-500 text-center text-[10px]"
        ></span>
      )}
      {children}
    </div>
  );
}
