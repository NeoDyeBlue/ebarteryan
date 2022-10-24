import Navbar from "../Navigation/Navbar";
import Footer from "../Navigation/Footer";
import MobileNavbar from "../Navigation/MobileNavbar";
import MessagesPopup from "../Popups/MessagesPopup";
import { useRouter } from "next/router";

export default function NavLayout({
  noFooter,
  children,
  noStickyNavbar = false,
}) {
  const router = useRouter();
  const currentPath = router.asPath;
  return (
    <>
      <Navbar sticky={!noStickyNavbar} />
      {children}
      <MobileNavbar
        className="fixed bottom-0 z-20 flex h-[70px]
      w-full items-center border-t border-gray-200 bg-white py-4 lg:hidden"
      />
      {currentPath !== "/messages" && (
        <MessagesPopup
          hasBadge={true}
          className="pointer-events-none fixed bottom-0 z-40 hidden w-full lg:block"
        />
      )}
      {!noFooter && <Footer />}
    </>
  );
}
