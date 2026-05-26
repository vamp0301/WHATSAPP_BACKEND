import { useEffect, useMemo } from "react";

import { io } from "socket.io-client";

import { SocketContext } from "./socket.context";

export const SocketProvider = ({ children }) => {

  const token = localStorage.getItem("token");

  const socket = useMemo(() => {

    return io("http://localhost:3020", {
      auth: {
        token
      }
    });

  }, [token]);

  useEffect(() => {

    return () => {
      socket.disconnect();
    };

  }, [socket]);

  return (

    <SocketContext.Provider value={socket}>

      {children}

    </SocketContext.Provider>
  );
};