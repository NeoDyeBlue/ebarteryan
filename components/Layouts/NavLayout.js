import Navbar from "../Navigation/Navbar";
import Footer from "../Navigation/Footer";
import MobileNavbar from "../Navigation/MobileNavbar";
import MessagesPopup from "../Popups/MessagesPopup";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function NavLayout({
  noFooter,
  children,
  noStickyNavbar = false,
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const currentPath = router.asPath;
  const [isHydrated, setIsHydrated] = useState(false);

  //Wait till NextJS rehydration completes
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <>
      {isHydrated && (
        <>
          <Navbar sticky={!noStickyNavbar} />
          {children}
          {currentPath !== "/messages" &&
            session &&
            status == "authenticated" && (
              <MessagesPopup
                hasBadge={true}
                className="pointer-events-none fixed bottom-0 z-50 w-full lg:block"
              />
            )}
          {!noFooter && <Footer />}
          <MobileNavbar
            className={`${
              currentPath == "/messages" ? "fixed" : "sticky"
            } bottom-0 z-20 flex h-[70px] w-full items-center border-t border-gray-200 bg-white py-4 md:hidden`}
          />
        </>
      )}
    </>
  );
}
