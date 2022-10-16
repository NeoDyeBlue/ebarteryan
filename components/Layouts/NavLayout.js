import Navbar from "../Navigation/Navbar";
import Footer from "../Navigation/Footer";
import MobileNavbar from "../Navigation/MobileNavbar";
import MessagesPopup from "../Popups/MessagesPopup";

export default function NavLayout({ noFooter, children }) {
  return (
    <>
      <Navbar />
      {children}
      <MobileNavbar
        className="container fixed bottom-0 z-20 mx-auto flex
      h-[70px] w-full items-center border-t border-gray-200 bg-white py-4 lg:hidden"
      />
      <MessagesPopup
        hasBadge={true}
        className="pointer-events-none fixed bottom-0 z-40 hidden w-full lg:block"
      />
      {!noFooter && <Footer />}
    </>
  );
}
