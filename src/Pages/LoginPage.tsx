import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { loginUser, clearError } from '../store/slices/authSlice';
import AuthForm from '../components/AuthForm/AuthForm';

const LoginPage: React.FC = () => {
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

  const handleLogin = async (data: any) => {
    const result = await dispatch(loginUser({
      email: data.email,
      password: data.password
    }));
    
    if (loginUser.fulfilled.match(result)) {
      navigate('/home');
    }
  };

  const handleSwitchToRegister = () => {
    navigate('/register');
  };

  return (
    <AuthForm
      type="login"
      onSubmit={handleLogin}
      onSwitchForm={handleSwitchToRegister}
      loading={loading}
      error={error}
    />
  );
};

export default LoginPage;