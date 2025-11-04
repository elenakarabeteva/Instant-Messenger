// src/Chat.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import ChannelModal from "./components/ChannelModal";
import socket from '../../socket';
import styles from './chat.module.scss';

function Chat() {
    const navigate = useNavigate();

    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const [currentUser, setCurrentUser] = useState(parsedUser || null);

    useEffect(() => {
        if (!parsedUser || !parsedUser.username) {
            navigate("/login", { replace: true });
        }
    }, [parsedUser, navigate]);


    const [channels, setChannels] = useState([]);
    const [currentChannel, setCurrentChannel] = useState("");
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [channelMessages, setChannelMessages] = useState([]);
    const [channelUsers, setChannelUsers] = useState([]);
    const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState({});

    useEffect(() => {
        if (!currentUser) return;

        socket.connect();
        socket.emit('log', currentUser);

        loadChannels();
        loadAllUsers();

        socket.on('receive-message', (newMessage) => {
            setChannelMessages((prev) => [...prev, newMessage]);
        })
        return () => {
            socket.disconnect();
        };
    }, [currentUser]);


    const loadChannels = async () => {
        try {
            const res = await fetch("http://localhost:4002/api/channels");
            const channelsArr = await res.json();

            setChannels(channelsArr);

            if (!currentChannel && channelsArr.length > 0) {
                setCurrentChannel(channelsArr[0]._id);
            }
        } catch (err) {
            console.error("Грешка при loadChannels:", err);
        }
    };

    const loadAllUsers = async () => {
        try {
            const fetchedUsers = await fetch("http://localhost:4002/api/users");
            const usersArr = await fetchedUsers.json();
            const onlyUsernames = usersArr.map((u) => ({ username: u.username, name: u.name, _id: u._id }));
            setUsers(onlyUsernames);
        } catch (err) {
            console.error("Грешка при loadAllUsers:", err);
        }
    };

    useEffect(() => {
        const fetchChannelData = async () => {
            if (!currentChannel) {
                setChannelMessages([]);
                setChannelUsers([]);
                return;
            }

            try {
                socket.emit('join-channel', { channelId: currentChannel });
                const resMsgs = await fetch(
                    `http://localhost:4002/api/messages/${currentChannel}`
                );
                const msgs = await resMsgs.json();
                setChannelMessages(msgs);

                const resUsers = await fetch(
                    `http://localhost:4002/api/users/${currentChannel}`
                );
                const channelUsersArr = await resUsers.json();
                setChannelUsers(channelUsersArr);
            } catch (err) {
                console.error("Грешка при fetchChannelData:", err);
            }
        };

        fetchChannelData();
    }, [currentChannel]);

    useEffect(() => {
        const selectedChannel = channels.find((ch) => ch._id === currentChannel);

        setSelectedChannel(selectedChannel);
    }, [currentChannel]);

    const handleSendPublicMessage = (text) => {
        if (!text || !currentChannel) return;

        const message = {
            sender_id: currentUser,
            chat_id: currentChannel,
            content: text,
            timestamp: new Date()
        };

        socket.emit('send-message', {
            channelId: currentChannel,
            message
        });
    };

    const handleSelectChannel = (channelId) => {
        setCurrentChannel(channelId);
    };

    const handleSelectUser = async (user) => {
        if (user._id === selectedUser._id)
            return;

        setSelectedUser(user);

        try {
            const res = await fetch(
                `http://localhost:4002/api/channels/private-channel/${currentUser._id}/${user._id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: user.name })
                }
            );

            const channel = await res.json();
            setCurrentChannel(channel._id);
            setChannels([...channels, channel])
        } catch (err) {
            console.error("Грешка при fetchPrivateMessages:", err);
        }
    };

    if (!currentUser) {
        return null;
    }

    const handleSearch = async (chatText) => {
        try {
            const res = await fetch(`http://localhost:4002/api/messages/search`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        searchQuery: chatText,
                        channelId: currentChannel,
                    })
                }
            );

            const searchResults = await res.json();
            setChannelMessages(searchResults);
        } catch (err) {
            console.error("Грешка при api/messages/search:", err);
        }
    };

    const handleUpdateChannel = async (channel) => {
        setCurrentChannel(channel._id);
        setSelectedChannel(channel);

        setChannels(channels.map(ch =>
            ch._id === channel._id
                ? channel
                : ch
        ));
    };

    return (
        <div className={styles['chat-container']}>
            <div className={styles['chat-page app']} style={{ display: "flex", width: "100%", height: "100vh" }}>
                {/* Sidebar: канали + потребители */}
                <Sidebar
                    channels={channels}
                    currentChannel={currentChannel}
                    onSelectChannel={handleSelectChannel}
                    users={users}
                    currentUser={currentUser}
                    selectedUser={selectedUser}
                    onSelectUser={handleSelectUser}
                />

                {/* Main area */}
                <div style={{ display: "flex", width: "100%" }} >
                    {currentChannel ? (
                        <>
                            <ChatWindow
                                channelId={currentChannel}
                                channelLabel={
                                    selectedChannel?.name || ""
                                }
                                messages={channelMessages}
                                onSendMessage={handleSendPublicMessage}
                                onOpenSettings={() => setIsChannelModalOpen(true)}
                                users={users}
                                onSearch={handleSearch}
                            />
                            <ChannelModal
                                isOpen={isChannelModalOpen}
                                channelLabel={
                                    selectedChannel?.name || ""
                                }
                                onUpdate={handleUpdateChannel}
                                selectedChannel={selectedChannel}
                                users={users.filter(user => selectedChannel?.user_list.includes(user._id))}
                                onClose={() => setIsChannelModalOpen(false)}
                            />
                        </>
                    ) : (
                        <div>
                            Изберете канал или потребител отляво, за да започнете.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Chat;
