import express from "express";
import http from "http";
import { Server } from "socket.io";
import axios from "axios";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://quickkchat.vercel.app",
    methods: ["GET", "POST"],
  },
});

const usersInRooms = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", ({ username, room }) => {
    console.log(`${username} is attempting to join room: ${room}`);

    if (!usersInRooms[room]) {
      usersInRooms[room] = new Set();
    }

    if (usersInRooms[room].has(username)) {
      console.log("Username taken:", username);
      socket.emit("username taken");
      return;
    }

    socket.username = username;
    socket.room = room;
    usersInRooms[room].add(username);
    socket.join(room);

    console.log(`${username} joined room: ${room}`);
    io.to(room).emit("chat message", `${username} joined the chat`);
  });

  socket.on("chat message", (msg) => {
    const room = socket.room;
    console.log(`Message received in room ${room}:`, msg);
    io.to(room).emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      const room = socket.room;
      console.log(`${socket.username} disconnected from room: ${room}`);
      usersInRooms[room].delete(socket.username);
      io.to(room).emit("chat message", `${socket.username} left the chat`);
    }
    console.log("User disconnected");
  });
});

app.get("/ping", (req, res) => {
  res.send("Server is alive");
});

setInterval(async () => {
  try {
    const response = await axios.get("https://chatapp-640m.onrender.com/ping");
    console.log("Self-ping successful:", response.data);
  } catch (error) {
    console.error("Self-ping error:", error.message);
  }
}, 5 * 60 * 1000);

server.listen(5000, () => {
  console.log("Listening on port 5000");
});
