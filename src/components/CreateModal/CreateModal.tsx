import React, { useState } from 'react';
import styles from './CreateModal.module.css';
import Button from '../Button/Button';
import Input from '../Input/Input';
import closeIcon from '../../assets/close.png';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: { listName: string }) => void;
}

const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [listName, setListName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!listName.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    if (onSubmit) {
      onSubmit({ listName: listName.trim() });
    }
    
    // Reset form
    setListName('');
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setListName('');
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create New Shopping List</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            <img src={closeIcon} alt="Close modal" width="24" height="24" />
          </button>
        </div>
        
        <div className={styles.content}>
          <p className={styles.subtitle}>Give your shopping list a name to get started.</p>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              label="List Name"
              placeholder="e.g. Weekly Groceries, Party Supplies"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              required
            />
            
            <div className={styles.actions}>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={isSubmitting || !listName.trim()}
              >
                {isSubmitting ? 'Creating...' : 'Create List'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;