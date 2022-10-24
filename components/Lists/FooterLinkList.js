export default function FooterLinkList({ title, children }) {
  return (
    <div className="grid grid-cols-[1fr_2fr] gap-4">
      <p className="font-display font-semibold">{title}</p>
      <ul className="flex flex-col gap-4 px-4 border-l border-gray-400">
        {children}
      </ul>
    </div>
  );
}
