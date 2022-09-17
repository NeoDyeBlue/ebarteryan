import Navbar from "../Navigation/Navbar";
import Footer from "../Navigation/Footer";
import MobileNavbar from "../Navigation/MobileNavbar";
import MessagesModal from "../Modals/MessagesModal";

export default function NavLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <MobileNavbar
        className="fixed container flex items-center w-full z-20
      bg-white mx-auto bottom-0 py-4 h-[70px] border-t border-gray-200 lg:hidden"
      />
      <MessagesModal
        hasBadge={true}
        className="fixed bottom-0 w-full pointer-events-none hidden lg:block z-10"
      />
      <Footer />
    </>
  );
}
