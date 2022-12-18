export default function StatusBadge({ status, statusText, type }) {
  let color = "";
  switch (status) {
    case "info":
      color = "bg-info-500 text-white";
      break;
    case "waiting":
      color = "bg-warning-500 text-black-light";
      break;
    case "accepted":
      color = "bg-success-500 text-white";
      break;
    case "failed":
      color = "bg-danger-500 text-white";
      break;
  }
  return (
    <span
      className={`text-center text-xs capitalize leading-none ${color} rounded-[10px] px-2 py-1 font-medium`}
    >
      {statusText}
    </span>
  );
}
