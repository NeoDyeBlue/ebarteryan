import useUserSocketInitializer from "../../lib/hooks/useUserSocketInitializer";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import useSocketStore from "../../store/useSocketStore";

export default function UserSocketInitializer({ children }) {
  // const connectUser = useUserSocketInitializer();
  const { data: session, status } = useSession();
  const { socket } = useSocketStore();

  useEffect(() => {
    if (
      socket &&
      session &&
      session.user.verified &&
      status == "authenticated"
    ) {
      socket.emit("user:connect", session.user.id);
    }
  }, [session, status, socket]);

  return <>{children}</>;
}
