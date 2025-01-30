import React, { useState } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(""); // Limpia cualquier mensaje anterior
        setLoggedIn(true); // Redirige a la página de bienvenida
      } else {
        setMessage(data.message); // Muestra el mensaje de error
      }
    } catch (error) {
      setMessage("Error al conectar con el servidor");
    }
  };

  if (loggedIn) {
    const handleLogout = async () => {
      try {
        const response = await fetch("http://localhost:3001/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
  
        const data = await response.json();
        if (response.ok) {
          setLoggedIn(false); // Cierra sesión
        } else {
          setMessage(data.message); // Muestra mensaje de error si falla
        }
      } catch (error) {
        setMessage("Error al cerrar sesión");
      }
    };
  
    return (
      <div className="App">
        <h1>¡Bienvenido!</h1>
        <p>Has iniciado sesión correctamente.</p>
        <button className="submit_button" onClick={handleLogout}>Logout</button>
        <p style={{ color: "red" }}>{message}</p>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="submit_button" type="submit">Login</button>
      </form>
      <p style={{ color: "red" }}>{message}</p>
    </div>
  );
}

export default App;
