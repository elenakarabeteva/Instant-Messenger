import React, { useState, useRef, useEffect } from 'react';
import { getInitials } from '../../../utils/getInitials';
import styles from './chatwindow.module.scss';

export default function ChatWindow({
    channelLabel,
    messages,
    onSendMessage,
    onOpenSettings,
    users,
    onSearch
}) {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);
    const [searchString, setSearchString] = useState('');

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        onSendMessage(inputValue.trim());
        setInputValue('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            onSearch(searchString);
            console.log(searchString);

        }, 500);

        // If `searchText` changes again before `delay` has passed, clear the previous timer.
        return () => {
            clearTimeout(handler);
        };
    }, [searchString]);

    return (
        <div className={styles.chat}>
            <header className={styles['chat-header']}>
                <div className={styles['chat-header-content']} style={{ width: '100%' }}>
                    <h2 className={styles['channel-title']}>{channelLabel}</h2>
                    <button className={styles['settings-btn']} onClick={onOpenSettings}>
                        Настройки
                    </button>
                    <input type='text' placeholder='Търси в чата...' value={searchString}
                        onChange={(e) => setSearchString(e.target.value)}></input>
                </div>
            </header>

            <section className={styles['chat-messages']}>
                {messages.map((msg, idx) => {
                    const msgUser = users.find(u => u._id === msg.sender_id)
                    
                    return msgUser && (
                        <div className={styles.message} key={idx}>
                            <div className={styles.avatar} >
                                {getInitials(msgUser?.name)}
                            </div>
                            <div className={styles.content} >
                                <div className={styles.name}>
                                    {msgUser?.name}{' '}
                                    <span className={styles.username}>(@{msgUser?.username})</span>
                                </div>

                                <div className={styles.text}>{msg.content}</div>
                                <div className={styles.time}>{msg.timestamp}</div>
                            </div>
                        </div>
                    )
                })}

                <div ref={messagesEndRef} />
            </section>

            <div className={styles['chat-input']} >
                <input
                    type="text"
                    className={styles['message-input']}
                    placeholder="Напиши съобщение..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button className={styles['send-button']} onClick={handleSend}>
                    Изпрати
                </button>
            </div>
        </div>
    );
}
