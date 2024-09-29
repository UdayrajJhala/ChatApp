import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chat-app-udayraj.vercel.app",
    methods: ["GET", "POST"],
  },
});

const usersInRooms = {}; 

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", ({ username, room }) => {
    
    if (!usersInRooms[room]) {
      usersInRooms[room] = new Set(); 
    }

    
    if (usersInRooms[room].has(username)) {
      socket.emit("username taken");
      return; 
    }

    socket.username = username;
    socket.room = room;
    usersInRooms[room].add(username);
    socket.join(room); 

    io.to(room).emit("chat message", `${username} joined ${room}`);
  });

  socket.on("chat message", (msg) => {
    const room = socket.room;
    io.to(room).emit("chat message", msg); 
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      const room = socket.room;
      usersInRooms[room].delete(socket.username); 
      io.to(room).emit("chat message", `${socket.username} left the chat`);
    }
    console.log("User disconnected");
  });
});

server.listen(5000, () => {
  console.log("Listening");
});
