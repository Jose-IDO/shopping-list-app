import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm/AuthForm';

const RegistrationPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegistration = async (data: any) => {
    setIsLoading(true);
    
    console.log('Registration attempt with:', data);
    

    setTimeout(() => {
      console.log('Registration successful');
      setIsLoading(false);
      
      // TODO: Set authentication state here
      // For now, navigate to login
      navigate('/login');
    }, 1000);
  };

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  return (
    <AuthForm
      type="register"
      onSubmit={handleRegistration}
      onSwitchForm={handleSwitchToLogin}
    />
  );
};

export default RegistrationPage;