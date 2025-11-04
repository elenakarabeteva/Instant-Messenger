import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './registerForm.module.scss';

const RegisterForm = () => {
    const [form, setForm] = useState({
        username: "",
        name: "",
        email: "",
        password: "",
        last_active: new Date(),
    });

    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setForm((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:4002/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/profile");
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("Registration failed. Try again later.");
            console.error("Error registering:", error);
        }
    };

    return (
        <div className={styles['register-container']}> 
            <div className={styles['form-box']}>
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <input id="username" placeholder="Username" onChange={handleChange} required />
                    <input id="name" placeholder="Full Name" onChange={handleChange} required />
                    <input id="email" placeholder="Email" type="email" onChange={handleChange} required />
                    <input id="password" type="password" placeholder="Password" onChange={handleChange} required />
                    <button type="submit">Register</button>
                </form>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default RegisterForm;
