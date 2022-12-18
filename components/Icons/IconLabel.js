export default function IconLabel({ children }) {
  return (
    <div className="flex items-center gap-1 rounded-[6px] border border-dashed border-success-600 bg-success-100 px-2 py-1 font-medium text-success-600">
      {children}
    </div>
  );
}
