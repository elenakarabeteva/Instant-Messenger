import React, { useState, useEffect } from 'react';
import { getInitials } from '../../../utils/getInitials';
import styles from './channel.module.scss';

export default function ChannelModal({
    isOpen,
    channelLabel,
    users,
    onClose,
    onUpdate,
    selectedChannel
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [nameDraft, setNameDraft] = useState(channelLabel);

    // Sync local draft whenever the channelLabel prop changes
    useEffect(() => {
        setNameDraft(channelLabel);
    }, [channelLabel]);

    if (!isOpen) return null;

    const startEditing = () => setIsEditing(true);
    const cancelEditing = () => {
        setNameDraft(channelLabel);
        setIsEditing(false);
    };
    const saveEditing = () => {
        const trimmed = nameDraft.trim();
        if (trimmed && trimmed !== channelLabel) {
            updateChannel();
        }
        setIsEditing(false);
    };

    const updateChannel = async () => {
        const updateChannel = { ...selectedChannel, name: nameDraft }
        
        try {
            const res = await fetch(
                `http://localhost:4002/api/channels/${selectedChannel._id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updateChannel)
                }
            );

            const updatedChannel = await res.json();
            onUpdate(updatedChannel);
        } catch (err) {
            console.error("Грешка при updateChannel:", err);
        }
    }

    return (
        <div className={styles.modal}>
            <div className={styles['modal-content']}>
                <div className={styles['modal-header']}>
                    {isEditing ? (
                        <input
                            className={styles['modal-channel-name-input']}
                            value={nameDraft}
                            onChange={e => setNameDraft(e.target.value)}
                            maxLength={50}
                        />
                    ) : (
                        <h3 className={styles['modal-channel-name']}>
                            {channelLabel}
                        </h3>
                    )}

                    {isEditing ? (
                        <div>
                            <button
                                className={styles['modal-save-btn']}
                                onClick={saveEditing}
                            >
                                Запази
                            </button>
                            <button
                                className={styles['modal-cancel-btn']}
                                onClick={cancelEditing}
                            >
                                Откажи
                            </button>
                        </div>
                    ) : (
                        <button
                            className={styles['modal-edit-btn']}
                            onClick={startEditing}
                        >
                            Редактирай
                        </button>
                    )}
                </div>

                <ul className={styles['user-list']}>
                    {users.map((u, idx) => (
                        <li key={u.user_id || idx}>
                            <div className={styles.avatar}>
                                {getInitials(u.name)}
                            </div>
                            <div>
                                <div>
                                    <strong>{u.name}</strong>
                                </div>
                                <div style={{ fontSize: '12px', color: 'gray' }}>
                                    @{u.username}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                <button
                    className={styles['close-modal']}
                    onClick={onClose}
                >
                    Затвори
                </button>
            </div>
        </div>
    );
}
