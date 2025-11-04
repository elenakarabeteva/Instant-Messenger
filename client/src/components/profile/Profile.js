import { useNavigate } from "react-router-dom";
import styles from "./profile.module.scss";

const Profile = () => {
  // 1. Call the hook at the top‐level of your component:
  const navigate = useNavigate();

  // 2. Safely read from localStorage. If there's no “user” item, JSON.parse(null) will give `null`.
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  const handleLogout = () => {
    // 3. Now you can use `navigate` here:
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className={styles.container}> 
      <div className={styles['left-panel']}>
      </div>
      <div className={styles['right-panel']}>
        <div className={styles['form-box']}>
          <h2>Welcome, {user?.name || "Guest"}</h2>
          <p>Username: {user?.username || "-"}</p>
          <p>Email: {user?.email || "-"}</p>
          <div className={styles['button-group']}>
            <button className={styles.logout} onClick={handleLogout}>Logout</button>
            <button className={styles.chats} onClick={() => navigate("/chat")}>Chats</button>
          </div>
          
        </div>
    </div>
      
    </div>
  );
};

export default Profile;
