import { useNavigate } from 'react-router-dom';
import styles from './sidebar.module.scss';

export default function Sidebar({
    channels,
    currentChannel,
    onSelectChannel,
    users,
    currentUser,
    selectedUser,
    onSelectUser,
}) {
    const navigate = useNavigate();

    return (
        <div className={styles.sidebar}>
            {/* Първа секция: Public channels */}
            <div style={{ marginBottom: '20px' }}>
                <div className={styles.logo}>ChatApp</div>
                <ul className={styles['channel-list']}>
                    {channels.filter(ch => ch.user_list.length > 2).map((ch) => (
                        <li
                            key={ch._id}
                            className={currentChannel === ch._id ? 'active' : ''}
                            onClick={() => {
                                onSelectChannel(ch._id);
                            }}
                        >
                            {ch.name}
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <div>
                    Потребители
                </div>
                <ul className={styles['channel-list']}>
                    {users
                        .filter((u) => u.username !== currentUser.username)
                        .map((user, i) => (
                            <li
                                key={i}
                                className={selectedUser === user.username ? 'active' : ''}
                                onClick={() => {
                                    onSelectUser(user);
                                }}
                            >
                                {user.name}
                            </li>
                        ))}
                </ul>
                <div onClick={() => navigate('/profile')}>
                    Влязъл: <strong>{currentUser.name}</strong>
                </div>
            </div>
        </div>
    );
}
