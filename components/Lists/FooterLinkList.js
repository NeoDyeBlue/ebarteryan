export default function FooterLinkList({ title, children }) {
  return (
    <div className="grid w-full grid-cols-[auto_1fr] gap-6">
      <p className="w-fit text-right font-display font-semibold">{title}</p>
      <ul className="grid w-full grid-flow-row grid-cols-[repeat(auto-fill,_minmax(100px,_1fr))] gap-4 border-l border-gray-400 px-4">
        {children}
      </ul>
    </div>
  );
}
