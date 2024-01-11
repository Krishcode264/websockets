import { User } from "core";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { userInfoState } from "../../../store/selectors/user-selector";

export const useSocket = () => {
  const user = useRecoilValue(userInfoState);
  const [socket, setSocket] = useState<Socket | null>(null);
  const handleSocketConnection = (newUser: User): Promise<void> => {
    return new Promise((resolve) => {
      try {
        const newsocket = io("http://localhost:8080", {
          path: "/socket",
          transports: ["websocket"],
        });
        console.log(newsocket)
        setSocket(() => newsocket);
        newsocket.emit("welcomeUser", newUser);
        resolve();
      } catch (err) {
        console.log("error in connect to socket", err);
      }
    });
  };
  

  useEffect(() => {
    (async () => {
      console.log(user,"from socket hook")
      if (user.name) {
        await handleSocketConnection(user);
      }
    })();
  }, [user]);

  return { socket };
};
