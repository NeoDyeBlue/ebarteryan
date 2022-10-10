export default function IconDescription({ icon, label, description }) {
  return (
    <div className="flex gap-3">
      <span className="flex h-[36px] w-[36px] flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
        {icon}
      </span>
      <div className="flex flex-col gap-1">
        <p className="font-display text-lg font-medium">{label}</p>
        <p>{description}</p>
      </div>
    </div>
  );
}
