import React, { useState } from 'react';
import styles from './AuthForm.module.css';
import Button from '../Button/Button';
import Input from '../Input/Input';
import shoppingCartIcon from '../../assets/shopping-cart.png';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit?: (data: any) => void;
  onSwitchForm?: () => void;
  loading?: boolean;
  error?: string | null;
}

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  cellNumber?: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  cellNumber?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, onSwitchForm, loading = false, error = null }) => {
  const isLogin = type === 'login';
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    cellNumber: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.firstName?.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName?.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.cellNumber?.trim()) {
        newErrors.cellNumber = 'Cell number is required';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (onSubmit) {
      await onSubmit(formData);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <div className={styles.icon}>
            <img src={shoppingCartIcon} alt="Spree Scribe" style={{ width: '32px', height: '32px' }} />
          </div>
          <div className={styles.appName}>Spree Scribe</div>
          <h1 className={styles.title}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className={styles.subtitle}>
            {isLogin 
              ? 'Sign in to access your shopping lists'
              : 'Sign up to start organizing your shopping'
            }
          </p>
        </div>

        {error && (
          <div className={styles.errorAlert}>
            {error}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          {!isLogin && (
            <div className={styles.nameFields}>
              <Input
                label="First Name"
                placeholder="John"
                value={formData.firstName || ''}
                onChange={handleInputChange('firstName')}
                error={errors.firstName}
                required
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                value={formData.lastName || ''}
                onChange={handleInputChange('lastName')}
                error={errors.lastName}
                required
              />
            </div>
          )}
          
          <Input
            label="Email"
            type="email"
            placeholder={isLogin ? "Enter your email" : "john@example.com"}
            value={formData.email}
            onChange={handleInputChange('email')}
            error={errors.email}
            required
          />

          {!isLogin && (
            <Input
              label="Cell Number"
              type="tel"
              placeholder="+27 ..."
              value={formData.cellNumber || ''}
              onChange={handleInputChange('cellNumber')}
              error={errors.cellNumber}
              required
            />
          )}

          <Input
            label="Password"
            type="password"
            placeholder={isLogin ? "Enter your password" : "Create a strong password"}
            value={formData.password}
            onChange={handleInputChange('password')}
            error={errors.password}
            required
          />

          {!isLogin && (
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword || ''}
              onChange={handleInputChange('confirmPassword')}
              error={errors.confirmPassword}
              required
            />
          )}

          <Button type="submit" className={styles.submitButton} disabled={loading}>
            {loading 
              ? (isLogin ? 'Signing In...' : 'Creating Account...') 
              : (isLogin ? 'Sign In' : 'Create Account')
            }
          </Button>
        </form>

        <div className={styles.footer}>
          <p className={styles.switchText}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              type="button" 
              className={styles.switchButton}
              onClick={onSwitchForm}
              disabled={loading}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;