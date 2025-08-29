import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm/AuthForm';

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (data: any) => {
    setIsLoading(true);
    
    console.log('Login attempt with:', data);
    

    setTimeout(() => {
      console.log('Login successful');
      setIsLoading(false);
      
      // TODO: Set authentication state here

    }, 1000);
  };

  const handleSwitchToRegister = () => {
    navigate('/register');
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