import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import ChatApp from "./ChatApp";
import "./App.css";

function LandingPage() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && room) {
      navigate(`/chat?username=${username}&room=${room}`);
    }
  };

  return (
    <div className="landing-page">
      <h1>QuickChat</h1>
      <p>Create or join a room and start chatting with your friends!</p>

      <form onSubmit={handleSubmit} className="landing-form">
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="landing-input"
        />
        <input
          type="text"
          placeholder="Enter room name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          required
          className="landing-input"
        />
        <button type="submit" className="landing-button">
          Start Chatting
        </button>
      </form>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatApp />} />
      </Routes>
    </Router>
  );
}

export default App;
