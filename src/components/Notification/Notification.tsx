import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { hideNotification } from '../../store/slices/uiSlice';
import styles from './Notification.module.css';
import closeIcon from '../../assets/close.png';

const Notification: React.FC = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state: RootState) => state.ui.notification);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  if (!notification) return null;

  return (
    <div className={`${styles.notification} ${styles[notification.type]}`}>
      <div className={styles.content}>
        <span className={styles.message}>{notification.message}</span>
        <button 
          className={styles.closeButton} 
          onClick={() => dispatch(hideNotification())}
        >
          <img src={closeIcon} alt="Close" style={{ width: '16px', height: '16px' }} />
        </button>
      </div>
    </div>
  );
};

export default Notification;