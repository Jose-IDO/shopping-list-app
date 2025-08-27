import React, { useState } from 'react';
import AuthForm from '../components/AuthForm/AuthForm';

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: any) => {
    setIsLoading(true);
    
    // Placeholder login logic
    console.log('Login attempt with:', data);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Login successful');
      setIsLoading(false);
      // TODO: Navigate to home page after successful login
      // TODO: Store user authentication state
    }, 1000);
  };

  const handleSwitchToRegister = () => {
    // TODO: Navigate to registration page
    console.log('Switch to registration page');
  };

  return (
    <AuthForm
      type="login"
      onSubmit={handleLogin}
      onSwitchForm={handleSwitchToRegister}
    />
  );
};

export default LoginPage;