import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from '../../socket';
import styles from './login.module.scss';

function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);
    
    const res = await fetch("http://localhost:4002/api/auth/login", { //here
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("user", JSON.stringify(data.user));

      socket.auth = { userId: data.user._id };
      socket.connect();

      navigate("/chat");
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div className={styles['profile-container']}> 
      <div className={styles['form-box']}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input id="email" placeholder="Email" onChange={handleChange} required />
          <input id="password" type="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">Login</button>
        </form>
        <p>{message}</p>
      </div>
    </div>
    
  );
}

export default LoginForm;