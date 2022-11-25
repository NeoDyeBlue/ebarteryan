export default function UserOfferList({ children }) {
  return (
    <ul className="my-4 grid min-h-[400px] w-full gap-4 md:my-0 md:grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))]">
      {children}
    </ul>
  );
}
