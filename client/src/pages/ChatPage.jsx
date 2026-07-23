import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import axios from 'axios';

const API = 'https://skillsphere-server-3b4k.onrender.com/api';
const SOCKET_URL = 'https://skillsphere-server-3b4k.onrender.com';

function ChatPage() {
  const { userId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [conversation, setConversation] = useState(null);
  const [typing, setTyping] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user) return;

    // Connect socket
    socketRef.current = io(SOCKET_URL, {
      query: { userId: user._id }
    });

    const initChat = async () => {
      try {
        // Get conversation
        const res = await axios.get(`${API}/messages/conversation/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConversation(res.data);

        // Get other user info
        const otherUserId = res.data.participants.find(p => p._id !== user._id);
        if (otherUserId) setOtherUser(otherUserId);

        // Join room
        socketRef.current.emit('joinRoom', res.data._id);

        // Get messages
        const msgRes = await axios.get(`${API}/messages/${res.data._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(msgRes.data);
      } catch (err) {
        console.log(err);
      }
    };

    initChat();

    // Listen for new messages
    socketRef.current.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    // Listen for typing
    socketRef.current.on('userTyping', () => {
      setTyping(true);
      setTimeout(() => setTyping(false), 2000);
    });

    return () => socketRef.current?.disconnect();
  }, [userId, user, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim() || !conversation) return;
    socketRef.current.emit('sendMessage', {
      convoId: conversation._id,
      senderId: user._id,
      text
    });
    setText('');
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    if (conversation) {
      socketRef.current.emit('typing', {
        convoId: conversation._id,
        userId: user._id
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  if (!user) return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Please login first</h2>
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>

      {/* Chat Header */}
      <div style={{
        background: 'white', borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#1a1a2e', padding: '15px 20px',
          display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: '#3498db', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '16px'
          }}>
            {otherUser?.name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <div style={{ color: 'white', fontWeight: 'bold' }}>
              {otherUser?.name || 'Chat'}
            </div>
            <div style={{ color: '#a0a0a0', fontSize: '12px' }}>
              {typing ? 'typing...' : 'online'}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          height: '450px', overflowY: 'auto',
          padding: '20px', background: '#f8f9fa'
        }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#999', marginTop: '150px' }}>
              No messages yet. Say hello! 👋
            </div>
          ) : (
            messages.map((msg, i) => {
              const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
              return (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: isMe ? 'flex-end' : 'flex-start',
                  marginBottom: '15px'
                }}>
                  <div style={{
                    maxWidth: '65%',
                    background: isMe ? '#3498db' : 'white',
                    color: isMe ? 'white' : '#333',
                    padding: '12px 16px',
                    borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>
                    {msg.text}
                    <div style={{
                      fontSize: '10px',
                      color: isMe ? 'rgba(255,255,255,0.7)' : '#999',
                      marginTop: '4px', textAlign: 'right'
                    }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {typing && (
            <div style={{ color: '#999', fontSize: '13px', fontStyle: 'italic' }}>
              typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '15px 20px', borderTop: '1px solid #eee',
          display: 'flex', gap: '10px', background: 'white'
        }}>
          <input
            value={text}
            onChange={handleTyping}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            style={{
              flex: 1, padding: '12px 15px', border: '1px solid #ddd',
              borderRadius: '25px', fontSize: '14px', outline: 'none'
            }}
          />
          <button onClick={handleSend} style={{
            background: '#3498db', color: 'white', border: 'none',
            padding: '12px 20px', borderRadius: '25px',
            cursor: 'pointer', fontSize: '14px', fontWeight: 'bold',
            width: 'auto'
          }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;