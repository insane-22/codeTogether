const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "Welcome to codeTogether",
  });
});

const userSocketMap = {};
const roomCodeMap = {};

async function getUsers(roomId, io) {
  const socketsInRoom = io.sockets.adapter.rooms.get(roomId);

  if (socketsInRoom) {
    const users = Array.from(socketsInRoom).map((socketId) => ({
      socketId,
      username: userSocketMap[socketId],
    }));
    return users;
  } else {
    return [];
  }
}

async function updateUsersnCode(io, socket, roomId) {
  socket.in(roomId).emit("member left", {
    username: userSocketMap[socket.id],
  });
  delete userSocketMap[socket.id];
  const users = await getUsers(roomId, io);
  socket.in(roomId).emit("updating-client-list", {
    users,
    newUser: null,
    socketId: null,
  });
  if (users.length === 0) {
    delete roomCodeMap(roomId);
  }
}

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  socket.on("user-joined", async (data) => {
    const { roomId, username } = data;
    console.log("username: ", username);
    // console.log(roomId)
    userSocketMap[socket.id] = username;
    socket.join(roomId);

    const users = await getUsers(roomId, io);
    console.log(users);
    users.forEach(({ socketId }) => {
      io.to(socketId).emit("updating-client-list", {
        users,
        newUser: username,
        socketId: socket.id,
      });
    });

    if (roomId in roomCodeMap) {
      io.to(socket.id).emit("on language change", {
        languageUsed: roomCodeMap[roomId].languageUsed,
      });
      io.to(socket.id).emit("on code change", {
        code: roomCodeMap[roomId].code,
      });
    }
  });

  socket.on("leave room", ({ roomId }) => {
    socket.leave(roomId);
    updateUsersnCode(io, socket, roomId);
  });

  socket.on("update language", ({ roomId, languageUsed }) => {
    if (roomId in roomCodeMap) {
      roomCodeMap["languageUsed"] = languageUsed;
    } else {
      roomCodeMap[roomId] = { languageUsed };
    }
  });

  socket.on("syncing the language", ({ roomId }) => {
    if (roomId in roomCodeMap) {
      socket.in(roomId).emit("on language change", {
        languageUsed: roomCodeMap[roomId].languageUsed,
      });
    }
  });

  socket.on("update code", ({ roomId, code }) => {
    if (roomId in roomCodeMap) {
      roomCodeMap[roomId]["code"] = code;
    } else {
      roomCodeMap[roomId] = { code };
    }
  });

  socket.on("syncing the code", ({ roomId }) => {
    if (roomId in roomCodeMap) {
      socket
        .in(roomId)
        .emit("on code change", { code: roomCodeMap[roomId].code });
    }
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      if (room in roomCodeMap) {
        updateUsersnCode(io, socket, room);
      }
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });

  socket.on("disconnect", function () {
    console.log("A user disconnected");
  });
});

const port = process.env.PORT;
server.listen(port, () => {
  console.log("server listening on port ", port);
});
