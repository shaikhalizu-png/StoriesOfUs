import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import axios from 'axios';
import API_URL from '../config';

function Chat() {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [showChat, setShowChat] = useState(false); // mobile: toggle between friends list and chat
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      const newSocket = io(API_URL);
      setSocket(newSocket);
      newSocket.emit('user_online', user._id);
      
      newSocket.on('online_users', (users) => setOnlineUsers(users));
      newSocket.on('receive_message', (message) => {
        if (message.senderId === selectedFriend?._id) {
          setMessages(prev => [...prev, message]);
        }
      });

      return () => newSocket.disconnect();
    }
  }, [user, selectedFriend]);

  useEffect(() => {
    fetchFriends();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/friends`);
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchMessages = async (friendId) => {
    try {
      const response = await axios.get(`${API_URL}/api/chat/${friendId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const selectFriend = (friend) => {
    setSelectedFriend(friend);
    fetchMessages(friend._id);
    setShowChat(true); // on mobile: switch to chat panel
  };

  const backToFriends = () => {
    setShowChat(false);
    setSelectedFriend(null);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedFriend) return;

    try {
      const response = await axios.post(`${API_URL}/api/chat/${selectedFriend._id}`, {
        content: newMessage
      });

      const messageData = {
        ...response.data,
        senderId: user._id,
        receiverId: selectedFriend._id
      };
      
      setMessages(prev => [...prev, response.data]);
      socket?.emit('send_message', messageData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!user) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Please login to access chat</h2>
      </div>
    );
  }

  return (
    <div className="chat-layout">
      {/* Friends List Panel */}
      <div className={`chat-friends-panel card ${showChat ? 'chat-friends-panel--hidden' : ''}`}>
        <h3 style={{ marginBottom: '1rem' }}>💬 Friends</h3>
        {friends.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No friends yet</p>
        ) : (
          friends.map(friend => (
            <div
              key={friend._id}
              onClick={() => selectFriend(friend)}
              className={`friend-item ${selectedFriend?._id === friend._id ? 'friend-item--active' : ''}`}
            >
              <span className={`online-dot ${onlineUsers.includes(friend._id) ? 'online-dot--online' : ''}`} />
              <span style={{ fontWeight: '500' }}>{friend.name}</span>
            </div>
          ))
        )}
      </div>

      {/* Chat Area Panel */}
      <div className={`chat-area-panel card ${!showChat && selectedFriend === null ? 'chat-area-panel--empty' : ''} ${!showChat ? 'chat-area-panel--hidden' : ''}`}>
        {selectedFriend ? (
          <>
            <div className="chat-header">
              <button className="btn btn-secondary chat-back-btn" onClick={backToFriends}>
                ← Back
              </button>
              <h3>Chat with {selectedFriend.name}</h3>
            </div>
            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message-row ${msg.sender._id === user._id ? 'message-row--sent' : 'message-row--received'}`}>
                  <div className={`message-bubble ${msg.sender._id === user._id ? 'message-bubble--sent' : 'message-bubble--received'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="chat-input-row">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="chat-input"
              />
              <button type="submit" className="btn btn-primary">Send</button>
            </form>
          </>
        ) : (
          <div className="chat-empty">
            Select a friend to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;

