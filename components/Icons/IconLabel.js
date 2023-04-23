export default function IconLabel({ children }) {
  return (
    <span className="flex items-center gap-1 rounded-[6px] border border-dashed border-green-600 bg-green-100 px-2 py-1 font-medium text-green-600">
      {children}
    </span>
  );
}
