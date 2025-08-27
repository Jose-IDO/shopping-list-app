import React, { useState } from 'react';
import AuthForm from '../components/AuthForm/AuthForm';

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: any) => {
    setIsLoading(true);
    

    console.log('Login attempt with:', data);
    

    setTimeout(() => {
      console.log('Login successful');
      setIsLoading(false);

    }, 1000);
  };

  const handleSwitchToRegister = () => {

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