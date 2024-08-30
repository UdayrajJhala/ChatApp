import React, { useState, useEffect } from "react";
import "./ChatApp.css";
import logo from "./logo.png";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input) {
      socket.emit("chat message", input); 
      setInput(""); 
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
          <div key={index} className={index % 2 === 0 ? "sender" : "receiver"}>
            <p className="message-content">{msg}</p>
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
