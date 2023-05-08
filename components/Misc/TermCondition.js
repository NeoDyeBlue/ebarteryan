export default function TermCondition({ label = "", children }) {
  return (
    <div className="flex flex-col gap-2 font-body">
      <p className="font-display font-semibold">{label}</p>
      {children}
    </div>
  );
}
