import CreationNavbar from "../Navigation/CreationNavbar";

export default function CreationLayout({ children }) {
  return (
    <>
      <CreationNavbar />
      {children}
    </>
  );
}
