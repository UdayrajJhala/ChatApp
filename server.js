import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", (username) => {

    socket.username = username;
    io.emit("chat message", `${username} joined the chat`);
  });

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      io.emit("chat message", `${socket.username} left the chat`);
    }
    console.log("User disconnected");
  });
});

server.listen(5000, () => {
  console.log("Listening on http://localhost:5000");
});
