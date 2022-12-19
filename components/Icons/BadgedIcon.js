export default function BadgedIcon({ hasBadge = false, children }) {
  return (
    <>
      <div className="relative">
        {hasBadge && (
          <span
            className="absolute top-[-14%] right-[-16%] h-[14px] w-[14px] rounded-full 
        border-2 border-white bg-info-500 text-center text-[10px]"
          ></span>
        )}
        {children}
      </div>
    </>
  );
}
