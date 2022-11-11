import { CreationNavbar } from "../Navigation";
import { useState, useEffect } from "react";

export default function CreationLayout({ children }) {
  const [isHydrated, setIsHydrated] = useState(false);
  //Wait till NextJS rehydration completes
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <>
      {isHydrated && (
        <>
          <CreationNavbar />
          {children}
        </>
      )}
    </>
  );
}
