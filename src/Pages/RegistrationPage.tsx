import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { registerUser, clearError } from '../store/slices/authSlice';
import { showNotification } from '../store/slices/uiSlice';
import AuthForm from '../components/AuthForm/AuthForm';

const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleRegistration = async (data: any) => {
    const result = await dispatch(registerUser({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      cellNumber: data.cellNumber
    }));
    
    if (registerUser.fulfilled.match(result)) {
      dispatch(showNotification({
        message: 'Account created successfully! Please log in.',
        type: 'success'
      }));
      navigate('/login');
    }
  };

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  return (
    <AuthForm
      type="register"
      onSubmit={handleRegistration}
      onSwitchForm={handleSwitchToLogin}
      loading={loading}
      error={error}
    />
  );
};

export default RegistrationPage;