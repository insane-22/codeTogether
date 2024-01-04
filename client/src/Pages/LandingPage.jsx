import React, { useState } from "react";
import "../styles/Landingpage.css";
import { v4 as uuidv4, validate } from "uuid";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const createRoom = async () => {
    const id = uuidv4();
    setRoomId(id);
    Swal.fire({
      position: "top",
      icon: "success",
      title: "New room created successfully!",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  };

  const joinRoom = async () => {
    if (!roomId || !username) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Room ID and Username are required",
        timer: 3000,
        timerProgressBar: true,
      });
    } else if (!validate(roomId)) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Room ID is incorrect",
        timer: 3000,
        timerProgressBar: true,
      });
    } else {
      navigate(`/${roomId}`, {
        state: {
          username,
        },
      });
    }
  };

  return (
    <div className="container1">
      <div className="bubbles">
        <span style={{ "--i": 12 }}></span>
        <span style={{ "--i": 24 }}></span>
        <span style={{ "--i": 10 }}></span>
        <span style={{ "--i": 14 }}></span>
        <span style={{ "--i": 11 }}></span>
        <span style={{ "--i": 23 }}></span>
        <span style={{ "--i": 18 }}></span>
        <span style={{ "--i": 16 }}></span>
        <span style={{ "--i": 19 }}></span>
        <span style={{ "--i": 20 }}></span>
        <span style={{ "--i": 22 }}></span>
        <span style={{ "--i": 25 }}></span>
        <span style={{ "--i": 18 }}></span>
        <span style={{ "--i": 21 }}></span>
        <span style={{ "--i": 15 }}></span>
        <span style={{ "--i": 13 }}></span>
        <span style={{ "--i": 26 }}></span>
        <span style={{ "--i": 17 }}></span>
        <span style={{ "--i": 13 }}></span>
        <span style={{ "--i": 28 }}></span>
        <span style={{ "--i": 12 }}></span>
        <span style={{ "--i": 24 }}></span>
        <span style={{ "--i": 10 }}></span>
        <span style={{ "--i": 14 }}></span>
        <span style={{ "--i": 11 }}></span>
        <span style={{ "--i": 23 }}></span>
        <span style={{ "--i": 18 }}></span>
        <span style={{ "--i": 16 }}></span>
        <span style={{ "--i": 19 }}></span>
        <span style={{ "--i": 20 }}></span>
        <span style={{ "--i": 22 }}></span>
        <span style={{ "--i": 25 }}></span>
        <span style={{ "--i": 18 }}></span>
        <span style={{ "--i": 21 }}></span>
        <span style={{ "--i": 15 }}></span>
        <span style={{ "--i": 13 }}></span>
        <span style={{ "--i": 26 }}></span>
        <span style={{ "--i": 17 }}></span>
        <span style={{ "--i": 13 }}></span>
        <span style={{ "--i": 15 }}></span>
        <span style={{ "--i": 13 }}></span>
        <span style={{ "--i": 26 }}></span>
        <span style={{ "--i": 17 }}></span>
        <span style={{ "--i": 13 }}></span>
        <span style={{ "--i": 13 }}></span>
        <span style={{ "--i": 26 }}></span>
        <span style={{ "--i": 17 }}></span>
        <span style={{ "--i": 13 }}></span>
      </div>
      <div className="sub-main">
        <h1>&lt; codeTogether &gt;</h1>
        <div>
          <input
            type="text"
            placeholder="Enter Username"
            className="name"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <input
            type="text"
            placeholder="Enter Room id to join a room"
            className="roomId"
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
          />
        </div>
        <div className="login-button">
          <button className="create-room" onClick={joinRoom}>
            Join Room
          </button>
          <button className="join-room" onClick={createRoom}>
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
