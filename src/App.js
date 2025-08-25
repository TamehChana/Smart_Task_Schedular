import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from './contexts/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import TaskManager from './pages/TaskManager';
import CalendarView from './pages/CalendarView';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotificationProvider from './components/NotificationProvider';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
      setCurrentPage('dashboard');
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentPage('login');
    localStorage.removeItem('user');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onLogin={login} onSwitchToSignup={() => setCurrentPage('signup')} />;
      case 'signup':
        return <Signup onSignup={login} onSwitchToLogin={() => setCurrentPage('login')} />;
      case 'dashboard':
        return <Dashboard user={user} onNavigate={setCurrentPage} />;
      case 'tasks':
        return <TaskManager user={user} onNavigate={setCurrentPage} />;
      case 'calendar':
        return <CalendarView user={user} onNavigate={setCurrentPage} />;
      default:
        return <Dashboard user={user} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      <NotificationProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <AnimatePresence mode="wait">
            {isAuthenticated ? (
              <motion.div
                key="authenticated"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col min-h-screen"
              >
                <Navbar 
                  user={user} 
                  currentPage={currentPage}
                  onNavigate={setCurrentPage}
                  onLogout={logout}
                />
                <main className="flex-1">
                  {renderPage()}
                </main>
                <Footer />
              </motion.div>
            ) : (
              <motion.div
                key="auth"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="min-h-screen flex items-center justify-center p-4"
              >
                {renderPage()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </NotificationProvider>
    </AuthContext.Provider>
  );
}

export default App;
