import React, { useState } from 'react';
import AuthForm from '../components/AuthForm/AuthForm';

const RegistrationPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegistration = async (data: any) => {
    setIsLoading(true);
    

    console.log('Registration attempt with:', data);
    

    

    setTimeout(() => {
      console.log('Registration successful');
      setIsLoading(false);

    }, 1000);
  };

  const handleSwitchToLogin = () => {

    console.log('Switch to login page');
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