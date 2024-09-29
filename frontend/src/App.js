import React, { useState } from "react";
import ChatApp from "./ChatApp";
import Login from "./Login";

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  const handleLogin = (name, roomName) => {
    setUsername(name);
    setRoom(roomName);
  };

  const handleLoginRedirect = () => {
    setUsername("");
    setRoom("");
  };

  return (
    <div className="App">
      {username && room ? (
        <ChatApp
          username={username}
          room={room}
          onLoginRedirect={handleLoginRedirect}
        />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
