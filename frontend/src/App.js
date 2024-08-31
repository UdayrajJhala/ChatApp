import React, { useState } from "react";
import ChatApp from "./ChatApp";
import Login from "./Login";

function App() {
  const [username, setUsername] = useState("");

  const handleLogin = (name) => {
    setUsername(name); 
  };

  return (
    <div className="App">
      {username ? (
        <ChatApp username={username} /> 
      ) : (
        <Login onLogin={handleLogin} /> 
      )}
    </div>
  );
}

export default App;
