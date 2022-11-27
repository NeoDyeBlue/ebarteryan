export default function ConditionBadge({ condition }) {
  let color = "";
  switch (condition) {
    case "new":
      color = "bg-success-200";
      break;
    case "slightly used":
      color = "bg-success-200";
      break;
    case "mostly used":
      color = "bg-warning-200";
      break;
    case "old":
      color = "bg-warning-200";
      break;
    case "broken":
      color = "bg-danger-200";
      break;
  }
  return (
    <span
      className={`text-center text-xs ${color} w-fit whitespace-nowrap rounded-[10px] px-2 py-[0.2rem] align-middle font-medium text-black-light`}
    >
      {condition}
    </span>
  );
}
