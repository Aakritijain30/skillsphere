import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/index';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import GigListPage from './pages/GigListPage';
import GigDetailPage from './pages/GigDetailPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import Navbar from './components/Navbar';
import ReviewPage from './pages/ReviewPage';
import PaymentPage from './pages/PaymentPage';
import ChatPage from './pages/ChatPage';
import NotificationsPage from './pages/NotificationsPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<GigListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/gigs/:id" element={<GigDetailPage />} />
          <Route path="/reviews/:userId" element={<ReviewPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/chat/:userId" element={<ChatPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/post-gig" element={<GigListPage />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;