import { CategoryNavbar } from "../Navigation";

export default function CategoryLayout({ children }) {
  return (
    <>
      <CategoryNavbar />
      {children}
    </>
  );
}
