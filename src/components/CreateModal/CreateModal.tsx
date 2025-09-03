import React, { Component } from 'react';
import styles from './CreateModal.module.css';
import Button from '../Button/Button';
import Input from '../Input/Input';
import closeIcon from '../../assets/close.png';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: { listName: string }) => void;
}

interface State {
  listName: string;
  isSubmitting: boolean;
}

class CreateModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      listName: '',
      isSubmitting: false,
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.setState({ listName: '', isSubmitting: false });
    }
  }

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!this.state.listName.trim()) {
      return;
    }

    this.setState({ isSubmitting: true });
    
    if (this.props.onSubmit) {
      this.props.onSubmit({ listName: this.state.listName.trim() });
    }
    
    this.setState({
      listName: '',
      isSubmitting: false,
    });
  };

  handleClose = () => {
    this.setState({ listName: '' });
    this.props.onClose();
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ listName: e.target.value });
  };

  render() {
    const { isOpen } = this.props;
    const { listName, isSubmitting } = this.state;

    if (!isOpen) return null;

    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <h2 className={styles.title}>Create New Shopping List</h2>
            <button className={styles.closeButton} onClick={this.handleClose}>
              <img src={closeIcon} alt="Close" style={{ width: '24px', height: '24px' }} />
            </button>
          </div>
          
          <div className={styles.content}>
            <p className={styles.subtitle}>Give your shopping list a name to get started.</p>
            
            <form className={styles.form} onSubmit={this.handleSubmit}>
              <Input
                label="List Name"
                placeholder="e.g. Weekly Groceries, Party Supplies"
                value={listName}
                onChange={this.handleInputChange}
                required
              />
              
              <div className={styles.actions}>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={this.handleClose}
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
  }
}

export default CreateModal;