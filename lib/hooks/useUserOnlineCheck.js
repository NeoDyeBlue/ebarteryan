import { useState, useEffect, useCallback } from "react";
import useSocketStore from "../../store/useSocketStore";

export default function useUserOnlineCheck(client, userToCheck) {
  const [isOnline, setIsOnline] = useState(false);
  const { socket } = useSocketStore();

  useEffect(() => {
    const onlineUpdater = (id) => {
      if (userToCheck == id) {
        socket.emit("user-online-check", {
          client,
          userToCheck,
        });
      }
    };

    const onlineToggler = (result) => {
      console.log(result);
      if (result.user == userToCheck) {
        setIsOnline(result.isOnline);
      }
    };

    socket.on("user-connect", onlineUpdater);
    socket.on("user-disconnect", onlineUpdater);
    socket.on("user-is-online", onlineToggler);

    return () => {
      socket.off("user-connect", onlineUpdater);
      socket.off("user-disconnect", onlineUpdater);
      socket.off("user-is-online", onlineToggler);
    };
  }, [userToCheck, socket, client]);

  useEffect(() => {
    socket.emit("user-online-check", {
      client,
      userToCheck,
    });
  }, [userToCheck, socket, client]);

  // function onlineHandler() {

  // }

  return isOnline;
}
