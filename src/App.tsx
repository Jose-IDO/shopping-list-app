import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import RegistrationPage from './Pages/RegistrationPage';
import HomePage from './Pages/HomePage';
import ProfilePage from './Pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import './App.css';

const App: React.FC = () => {
 
  const isAuthenticated = false; 

  return (
    <Router>
      <div className="App">
        <Routes>
          {}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? <Navigate to="/home" replace /> : <RegistrationPage />
            } 
          />
          
          {}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
          {}
          <Route 
            path="/" 
            element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} 
          />
          
          {}
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;