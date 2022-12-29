import { useSession } from "next-auth/react";
import useSocketStore from "../../store/useSocketStore";

export default function useUserSocketInitializer() {
  const { data: session, status } = useSession();
  const { socket } = useSocketStore();

  function connectUser() {
    if (
      socket &&
      session &&
      session.user.verified &&
      status == "authenticated"
    ) {
      socket.emit("connect-user", session.user.id);
    }
  }

  return connectUser;
}
