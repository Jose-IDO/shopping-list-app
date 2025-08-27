import React, { useState } from 'react';
import LoginPage from './pages/LoginPage/LoginPage';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import HomePage from './pages/HomePage/HomePage';
import './App.css';

type PageType = 'login' | 'register' | 'home';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('login');


  const navigateTo = (page: PageType) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegistrationPage />;
      case 'home':
        return <HomePage />;
      default:
        return <LoginPage />;
    }
  };

  return (
    <div className="App">
 
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        background: '#000', 
        color: '#fff', 
        padding: '8px 16px', 
        zIndex: 9999,
        fontSize: '12px',
        display: 'flex',
        gap: '16px'
      }}>
        <span>Demo Navigation:</span>
        <button 
          onClick={() => navigateTo('login')}
          style={{ 
            background: currentPage === 'login' ? '#4ade80' : 'transparent', 
            border: '1px solid #4ade80', 
            color: currentPage === 'login' ? '#000' : '#4ade80',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
        <button 
          onClick={() => navigateTo('register')}
          style={{ 
            background: currentPage === 'register' ? '#4ade80' : 'transparent', 
            border: '1px solid #4ade80', 
            color: currentPage === 'register' ? '#000' : '#4ade80',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          Register
        </button>
        <button 
          onClick={() => navigateTo('home')}
          style={{ 
            background: currentPage === 'home' ? '#4ade80' : 'transparent', 
            border: '1px solid #4ade80', 
            color: currentPage === 'home' ? '#000' : '#4ade80',
            padding: '4px 8px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          Home
        </button>
      </div>
      

      <div style={{ marginTop: '40px' }}>
        {renderPage()}
      </div>
    </div>
  );
};

export default App;