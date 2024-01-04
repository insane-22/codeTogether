import React, { useEffect, useState } from "react";
import "../styles/Room.css";
import { useParams, useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import Swal from "sweetalert2";
import Client from "../components/Client";

const Room = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    socket.on("updating-client-list", ({ users, newUser, socketId }) => {
      if (newUser !== location.state?.username && newUser) {
        Swal.fire({
          position: "top",
          icon: "info",
          title: `${newUser} joined the room!`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
      setClients(users);
    });

    socket.on("member left", ({ username }) => {
      Swal.fire({
        position: "top",
        icon: "info",
        title: `${username} left the room!`,
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
    });

    return () => {
      socket.disconnect();
      socket.off("updating-client-list");
    };
  }, [socket]);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      Swal.fire({
        position: "top",
        title: "RoomID copied to Clipboard",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      Swal.fire({
        text: "Unable to copy Room ID",
        timer: 3000,
        timerProgressBar: true,
      });
      console.log(error);
    }
  };

  const leaveRoom = async () => {
    socket.emit("leave room",{roomId});
    // socket.disconnect()
      navigate("/", {
        replace: true,
        state: {},
      });
  };

  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logo">
            <h1>codeTogether</h1>
          </div>
          <h2>Connected</h2>
          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className="btn copyBtn" onClick={copyRoomId}>
          Copy ROOM ID
        </button>
        <button className="btn leaveBtn" onClick={leaveRoom}>
          Leave
        </button>
      </div>
      <div className="editorWrap">
        {/* <Editor
          // socketRef={socketRef}
          // roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }} */}
        {/* /> */}
      </div>
    </div>
  );
};

export default Room;
