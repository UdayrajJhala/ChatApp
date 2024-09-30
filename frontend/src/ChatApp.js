import React, { useState, useEffect, useRef } from "react";
import "./ChatApp.css";
import io from "socket.io-client";
import CryptoJS from "crypto-js";
import { useLocation, useNavigate } from "react-router-dom";

const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY;
const url = process.env.REACT_APP_BACKEND_URL;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ChatApp() {
  const query = useQuery();
  const username = query.get("username");
  const room = query.get("room");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);
  const chatWindowRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!username || !room) {
      navigate("/");
    }

    const newSocket = io(url);

    newSocket.on("connect", () => {
      setLoading(false);
      newSocket.emit("join", { username, room });
    });

    const handleMessage = (msg) => {
      let decryptedMsg = msg;
      if (msg.includes("joined") || msg.includes("left")) {
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

    const handleUsernameTaken = () => {
      alert("Username is already taken! Please choose another one.");
      navigate("/");
    };

    newSocket.on("chat message", handleMessage);
    newSocket.on("username taken", handleUsernameTaken);

    setSocket(newSocket);

    return () => {
      newSocket.off("chat message", handleMessage);
      newSocket.off("username taken", handleUsernameTaken);
      newSocket.disconnect();
    };
  }, [username, room, navigate]);

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
    if (msg.includes("joined") || msg.includes("left")) {
      return "system-message";
    } else {
      return msg.startsWith(`${username}:`) ? "sender" : "receiver";
    }
  };

  const formatMessage = (msg) => {
    if (msg.includes("joined") || msg.includes("left")) {
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

  const handleLeaveRoom = () => {
    if (socket) {
      socket.disconnect();
    }
    navigate("/"); 
  };

  return (
    <div className="chat-app">
      <header className="chat-header">
        <h1 className="chat-title">Chat Room: {room}</h1>
        <button className="leave-button" onClick={handleLeaveRoom}>
          Leave Room
        </button>
      </header>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <div className="loading-text">
            Please wait while the server is back up in a few seconds...
          </div>
        </div>
      ) : (
        <div className="chat-window" ref={chatWindowRef}>
          {messages.map((msg, index) => (
            <div key={index} className={getMessageClass(msg)}>
              <p className="message-content">{formatMessage(msg)}</p>
            </div>
          ))}
        </div>
      )}

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
