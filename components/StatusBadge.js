export default function StatusBadge({ type, statusText }) {
  let color = "";
  switch (type) {
    case "info":
      color = "bg-info-500 text-white";
      break;
    case "waiting":
      color = "bg-warning-500 text-black-light";
      break;
    case "success":
      color = "bg-success-500 text-white";
      break;
    case "failed":
      color = "bg-danger-500 text-white";
      break;
  }
  return (
    <span
      className={`text-center text-sm capitalize ${color} rounded-[10px] py-1 px-2`}
    >
      {statusText}
    </span>
  );
}
