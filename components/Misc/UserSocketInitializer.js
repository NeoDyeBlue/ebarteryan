import useUserSocketInitializer from "../../lib/hooks/useUserSocketInitializer";
import { useEffect } from "react";

export default function UserSocketInitializer({ children }) {
  const connectUser = useUserSocketInitializer();

  useEffect(() => {
    connectUser();
  }, [connectUser]);

  return <>{children}</>;
}
