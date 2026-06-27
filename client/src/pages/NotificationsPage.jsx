import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

function NotificationsPage() {
  const { user } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    const socket = io(SOCKET_URL, { query: { userId: user._id } });

    socket.on('newNotification', (notif) => {
      setNotifications(prev => [notif, ...prev]);
    });

    return () => socket.disconnect();
  }, [user]);

  const markRead = (id) => {
    setNotifications(notifications.map(n =>
      n._id === id ? { ...n, isRead: true } : n
    ));
  };

  const getIcon = (type) => {
    switch(type) {
      case 'proposal': return '📋';
      case 'payment': return '💰';
      case 'review': return '⭐';
      case 'message': return '💬';
      default: return '🔔';
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h1 style={{ color: '#1a1a2e' }}>Notifications</h1>
        <span style={{
          background: '#3498db', color: 'white',
          padding: '4px 12px', borderRadius: '15px', fontSize: '14px'
        }}>
          {notifications.filter(n => !n.isRead).length} unread
        </span>
      </div>

      <div style={{
        background: 'white', borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)', overflow: 'hidden'
      }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
            <div style={{ fontSize: '50px', marginBottom: '15px' }}>🔔</div>
            <h3>No notifications yet</h3>
            <p>You will see notifications here when something happens</p>
          </div>
        ) : (
          notifications.map((notif, i) => (
            <div
              key={i}
              onClick={() => markRead(notif._id)}
              style={{
                padding: '18px 20px',
                borderBottom: '1px solid #eee',
                background: notif.isRead ? 'white' : '#f0f7ff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                transition: 'background 0.2s'
              }}
            >
              <div style={{ fontSize: '28px' }}>{getIcon(notif.type)}</div>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#1a1a2e', marginBottom: '4px', fontWeight: notif.isRead ? 'normal' : 'bold' }}>
                  {notif.message}
                </p>
                <p style={{ color: '#999', fontSize: '12px' }}>
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              </div>
              {!notif.isRead && (
                <div style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: '#3498db', flexShrink: 0
                }} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;