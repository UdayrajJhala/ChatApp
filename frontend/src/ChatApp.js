import React, { useState, useEffect, useRef } from "react";
import "./ChatApp.css";
import logo from "./logo.png";
import io from "socket.io-client";
import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY;

function ChatApp({ username }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);
  const chatWindowRef = useRef(null); // Create a reference for the chat window

  useEffect(() => {
    const newSocket = io("https://chatapp-640m.onrender.com");
    setSocket(newSocket);

    newSocket.emit("join", username);

    const handleMessage = (msg) => {
      let decryptedMsg = msg;
      if (msg.includes("joined the chat") || msg.includes("left the chat")) {
        decryptedMsg = msg;
      } else {
        try {
          const bytes = CryptoJS.AES.decrypt(msg, ENCRYPTION_KEY);
          decryptedMsg = bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
          console.error("Failed to decrypt message:", error);
        }
      }
      setMessages((prevMessages) => [...prevMessages, decryptedMsg]);
    };

    newSocket.on("chat message", handleMessage);

    return () => {
      newSocket.off("chat message", handleMessage);
      newSocket.disconnect();
    };
  }, [username]);

  // Scroll to the bottom of the chat window whenever messages change
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input && socket) {
      const messageToSend = `${username}: ${input}`;
      const encryptedMsg = CryptoJS.AES.encrypt(
        messageToSend,
        ENCRYPTION_KEY
      ).toString();
      socket.emit("chat message", encryptedMsg);
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
      return <>{msg}</>;
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

      <div className="chat-window" ref={chatWindowRef}>
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
