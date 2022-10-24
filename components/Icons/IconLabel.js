export default function IconLabel({ children }) {
  return (
    <div className="flex items-center gap-1 rounded-[6px] border border-green-500 bg-green-500/5 px-2 py-1 font-medium text-green-500">
      {children}
    </div>
  );
}
