export default function CircleButton({ icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full hover:bg-gray-100/30"
    >
      {icon}
    </button>
  );
}
