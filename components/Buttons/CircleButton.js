export default function CircleButton({ icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
    >
      {icon}
    </button>
  );
}
