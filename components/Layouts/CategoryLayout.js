import { CategoryNavbar } from "../Navigation";
import { WelcomePopup } from "../Popups";

export default function CategoryLayout({ children }) {
  return (
    <>
      <WelcomePopup />
      <CategoryNavbar />
      {children}
    </>
  );
}
