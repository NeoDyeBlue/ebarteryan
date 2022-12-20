export default function OfferList({ children, grid = false }) {
  return (
    <ul
      className={`
  ${grid ? "grid gap-5 md:grid-cols-2" : "flex flex-col gap-5"}`}
    >
      {children}
    </ul>
  );
}
