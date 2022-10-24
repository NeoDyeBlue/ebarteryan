import { CreationNavbar } from "../Navigation";

export default function CreationLayout({ children }) {
  return (
    <>
      <CreationNavbar />
      {children}
    </>
  );
}
