import CategoryNavbar from "../Navigation/CategoryNavbar";

export default function CategoryLayout({ children }) {
  return (
    <>
      <CategoryNavbar />
      {children}
    </>
  );
}
