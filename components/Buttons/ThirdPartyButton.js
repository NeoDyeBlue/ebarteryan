export default function ThirdPartyButton({ icon, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap
  rounded-[10px] border border-black bg-white px-4 py-3 font-display font-medium hover:shadow-md"
    >
      {icon}
      {text}
    </button>
  );
}
