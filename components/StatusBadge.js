export default function StatusBadge({ status, statusText, type }) {
  let color = "";
  switch (status) {
    case "info":
      color = "bg-info-200";
      break;
    case "waiting":
      color = "bg-warning-200";
      break;
    case "success":
      color = "bg-success-200";
      break;
    case "failed":
      color = "bg-danger-200";
      break;
  }
  return (
    <span
      className={`text-center text-xs capitalize ${color} rounded-[10px] px-2 py-1 font-medium text-black-light`}
    >
      {statusText}
    </span>
  );
}
