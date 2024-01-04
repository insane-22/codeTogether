import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { io } from "socket.io-client";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const SocketContext = createContext();

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export function SocketProvider ({children})  {
  const [socket, setSocket] = useState(io.connect("localhost:7485"));
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();

  useEffect(() => {
    function kickStrangers() {
      navigate("/", { replace: true });
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Username is required",
        timer: 3000,
        timerProgressBar: true,
      });
    }

    if (location.state && location.state.username) {
      setSocket((prevSocket) => {
        prevSocket.emit("user-joined", {
          roomId,
          username: location.state.username,
        });
        return prevSocket;
      });
    } else {
      kickStrangers();
    }
  }, [location.state, roomId, navigate]);

  const val = useMemo(() => ({ socket }), [socket]);

  return (
    <SocketContext.Provider value={val}>
      {children}
    </SocketContext.Provider>
  );
};
