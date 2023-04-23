export default function UserOfferList({ children }) {
  return (
    <ul
      className="my-4 grid min-h-[400px] w-full grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-4 
    md:my-0"
    >
      {children}
    </ul>
  );
}
