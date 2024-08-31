import React, { useState, useEffect } from "react";
import "./ChatApp.css";
import logo from "./logo.png";
import io from "socket.io-client";

function ChatApp({ username }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.emit("join", username);

    const handleMessage = (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    };

    newSocket.on("chat message", handleMessage);

    return () => {
      newSocket.off("chat message", handleMessage);
      newSocket.disconnect();
    };
  }, [username]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input && socket) {
      socket.emit("chat message", `${username}: ${input}`);
      setInput("");
    }
  };

  const getMessageClass = (msg) => {
    if (msg.includes("joined the chat") || msg.includes("left the chat")) {
      return "system-message";
    } else {
      return msg.startsWith(`${username}:`) ? "sender" : "receiver";
    }
  };

  const formatMessage = (msg) => {
    if (msg.includes("joined the chat") || msg.includes("left the chat")) {
      return msg;
    } else {
      const [msgUsername, ...msgContent] = msg.split(": ");
      return (
        <>
          <strong>{msgUsername}</strong>: {msgContent.join(": ")}
        </>
      );
    }
  };

  return (
    <div className="chat-app">
      <header className="chat-header">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="chat-title">Chat App</h1>
      </header>

      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={getMessageClass(msg)}>
            <p className="message-content">{formatMessage(msg)}</p>
          </div>
        ))}
      </div>

      <form className="message-form" onSubmit={sendMessage}>
        <input
          type="text"
          className="message-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatApp;
