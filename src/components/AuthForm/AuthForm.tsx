// src/components/AuthForm/AuthForm.tsx
import React from 'react';
import styles from './AuthForm.module.css';
import Button from '../Button/Button';
import Input from '../Input/Input';
import cartIcon from '../../assets/shopping-cart.png';

interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit?: (data: any) => void;
  onSwitchForm?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, onSwitchForm }) => {
  const isLogin = type === 'login';

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <div className={styles.header}>
          <div className={styles.icon}>
            <img src={cartIcon} alt="Shopping cart" width="32" height="32" />
          </div>
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

        <form className={styles.form}>
          {!isLogin && (
            <div className={styles.nameFields}>
              <Input
                label="First Name"
                placeholder="John"
                required
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                required
              />
            </div>
          )}
          
          <Input
            label="Email"
            type="email"
            placeholder={isLogin ? "Enter your email" : "john@example.com"}
            required
          />

          {!isLogin && (
            <Input
              label="Cell Number"
              type="tel"
              placeholder="+27 123 456 7890"
              required
            />
          )}

          <Input
            label="Password"
            type="password"
            placeholder={isLogin ? "Enter your password" : "Create a strong password"}
            required
          />

          {!isLogin && (
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              required
            />
          )}

          <Button type="submit" className={styles.submitButton}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className={styles.footer}>
          <p className={styles.switchText}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              type="button" 
              className={styles.switchButton}
              onClick={onSwitchForm}
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