import React from "react";
import "./ChatApp.css";
import logo from "./logo.png";

const ChatApp = () => {
  return (
    <div className="chat-app">
      <header className="chat-header">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="chat-title">Chat App</h1>
      </header>

      <div className="chat-window">
        <div className="receiver">
          <p className="message-content">Hello! How are you?</p>
        </div>
        <div className="sender">
          <p className="message-content">I'm good, thanks! What about you?</p>
        </div>
      </div>

      <form className="message-form">
        <input
          type="text"
          className="message-input"
          placeholder="Type your message..."
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatApp;
