import { useState, useEffect, useCallback } from "react";
import useSocketStore from "../../store/useSocketStore";

export default function useUserOnlineCheck(client, userToCheck) {
  const [isOnline, setIsOnline] = useState(false);
  const { socket } = useSocketStore();

  useEffect(() => {
    const onlineUpdater = (id) => {
      if (userToCheck == id) {
        socket.emit("user:online-check", {
          client,
          userToCheck,
        });
      }
    };

    const onlineToggler = (result) => {
      if (result.user == userToCheck) {
        setIsOnline(result.isOnline);
      }
    };

    socket.on("user:connected", onlineUpdater);
    socket.on("user:disconnected", onlineUpdater);
    socket.on("user:online", onlineToggler);

    return () => {
      socket.off("user:connected", onlineUpdater);
      socket.off("user:disconnected", onlineUpdater);
      socket.off("user:online", onlineToggler);
    };
  }, [userToCheck, socket, client]);

  useEffect(() => {
    socket.emit("user:online-check", {
      client,
      userToCheck,
    });
  }, [userToCheck, socket, client]);

  // function onlineHandler() {

  // }

  return isOnline;
}
