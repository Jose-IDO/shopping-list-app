import React from 'react';
import styles from './CreateModal.module.css';
import Button from '../Button/Button';
import Input from '../Input/Input';
import closeIcon from '../../assets/close.png';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create New Shopping List</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <img src={closeIcon} alt="Close modal" width="24" height="24" />
          </button>
        </div>
        
        <div className={styles.content}>
          <p className={styles.subtitle}>Give your shopping list a name to get started.</p>
          
          <form className={styles.form}>
            <Input
              label="List Name"
              placeholder="e.g. Weekly Groceries, Party Supplies"
              required
            />
            
            <div className={styles.actions}>
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary">
                Create List
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;