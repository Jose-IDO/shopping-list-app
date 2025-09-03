import React, { Component } from 'react';
import styles from './ItemModal.module.css';
import Button from '../Button/Button';
import Input from '../Input/Input';

import closeIcon from '../../assets/close.png';

interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  category: string;
  image?: string;
  shoppingListId: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    quantity: number;
    notes: string;
    category: string;
    image?: string;
  }) => void;
  item?: ShoppingListItem | null;
}

interface State {
  name: string;
  quantity: number;
  notes: string;
  category: string;
  image: string;
  imageFile: File | null;
  isSubmitting: boolean;
  errors: {
    name?: string;
    category?: string;
  };
}

const CATEGORIES = [
  'Dairy',
  'Bakery',
  'Meat',
  'Produce',
  'Frozen',
  'Pantry',
  'Beverages',
  'Snacks',
  'Health & Beauty',
  'Household',
  'Other'
];

class ItemModal extends Component<Props, State> {
  private fileInputRef = React.createRef<HTMLInputElement>();

  constructor(props: Props) {
    super(props);
    this.state = {
      name: '',
      quantity: 1,
      notes: '',
      category: 'Other',
      image: '',
      imageFile: null,
      isSubmitting: false,
      errors: {},
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.resetForm();
    }
    if (prevProps.item !== this.props.item && this.props.item) {
      this.loadItemData();
    }
  }

  resetForm = () => {
    this.setState({
      name: '',
      quantity: 1,
      notes: '',
      category: 'Other',
      image: '',
      imageFile: null,
      isSubmitting: false,
      errors: {},
    });
  };

  loadItemData = () => {
    const { item } = this.props;
    if (item) {
      this.setState({
        name: item.name,
        quantity: item.quantity,
        notes: item.notes || '',
        category: item.category,
        image: item.image || '',
        imageFile: null,
        errors: {},
      });
    }
  };

  validateForm = (): boolean => {
    const errors: { name?: string; category?: string } = {};

    if (!this.state.name.trim()) {
      errors.name = 'Item name is required';
    }

    if (!this.state.category) {
      errors.category = 'Category is required';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }

    this.setState({ isSubmitting: true });

    let imageUrl = this.state.image;
    if (this.state.imageFile) {
      imageUrl = await this.uploadImage(this.state.imageFile);
    }

    this.props.onSubmit({
      name: this.state.name.trim(),
      quantity: this.state.quantity,
      notes: this.state.notes.trim(),
      category: this.state.category,
      image: imageUrl,
    });

    this.setState({ isSubmitting: false });
  };

  uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string || '');
      };
      reader.readAsDataURL(file);
    });
  };

  handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      this.setState({ imageFile: file });
      const reader = new FileReader();
      reader.onload = (e) => {
        this.setState({ image: e.target?.result as string || '' });
      };
      reader.readAsDataURL(file);
    }
  };

  handleRemoveImage = () => {
    this.setState({ image: '', imageFile: null });
    if (this.fileInputRef.current) {
      this.fileInputRef.current.value = '';
    }
  };

  render() {
    const { isOpen, onClose, item } = this.props;
    const { name, quantity, notes, category, image, isSubmitting, errors } = this.state;

    if (!isOpen) return null;

    const isEditing = !!item;
    const title = isEditing ? 'Edit Item' : 'Add New Item';

    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button className={styles.closeButton} onClick={onClose}>
              <img src={closeIcon} alt="Close" style={{ width: '20px', height: '20px' }} />
            </button>
          </div>
          
          <div className={styles.content}>
            <form className={styles.form} onSubmit={this.handleSubmit}>
              <Input
                label="Item Name"
                placeholder="e.g. Milk, Bread, Apples"
                value={name}
                onChange={(e) => this.setState({ name: e.target.value, errors: { ...errors, name: undefined } })}
                error={errors.name}
                required
              />

              <div className={styles.row}>
                <div className={styles.quantityContainer}>
                  <label className={styles.label}>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => this.setState({ quantity: parseInt(e.target.value) || 1 })}
                    className={styles.quantityInput}
                  />
                </div>

                <div className={styles.categoryContainer}>
                  <label className={styles.label}>Category *</label>
                  <select
                    className={styles.select}
                    value={category}
                    onChange={(e) => this.setState({ category: e.target.value, errors: { ...errors, category: undefined } })}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && <span className={styles.error}>{errors.category}</span>}
                </div>
              </div>

              <div className={styles.notesContainer}>
                <label className={styles.label}>Notes (Optional)</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Any additional notes..."
                  value={notes}
                  onChange={(e) => this.setState({ notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className={styles.imageContainer}>
                <label className={styles.label}>Image (Optional)</label>
                <input
                  ref={this.fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={this.handleImageSelect}
                  className={styles.fileInput}
                />
                {image && (
                  <div className={styles.imagePreview}>
                    <img src={image} alt="Preview" className={styles.previewImage} />
                    <button
                      type="button"
                      className={styles.removeImageButton}
                      onClick={this.handleRemoveImage}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
              
              <div className={styles.actions}>
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={isSubmitting || !name.trim()}
                >
                  {isSubmitting ? 'Saving...' : (isEditing ? 'Update Item' : 'Add Item')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ItemModal;