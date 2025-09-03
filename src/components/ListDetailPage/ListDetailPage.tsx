import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from '../../utils/withRouter';
import { RootState, AppDispatch } from '../../store';
import { fetchItems, createItem, updateItem, deleteItem, updateShoppingList } from '../../store/slices/shoppingListSlice';

import styles from './ListDetailPage.module.css';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';

import ItemModal from '../../components/ItemModal/ItemModal';
import plusIcon from '../../assets/plus.png';
import closeIcon from '../../assets/close.png';

import ascendingIcon from '../../assets/ascending-sort.png';
import descendingIcon from '../../assets/descending-sort.png';

type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'category-asc' | 'category-desc';

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

interface ShoppingList {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  itemCount: number;
  isShared: boolean;
  sharedWith: string[];
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cellNumber: string;
}

interface Props {
  user: User | null;
  lists: ShoppingList[];
  items: { [listId: string]: ShoppingListItem[] };
  loading: boolean;
  fetchItems: (listId: string) => void;
  createItem: (item: Omit<ShoppingListItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (data: { id: string; updates: Partial<ShoppingListItem> }) => void;
  deleteItem: (data: { id: string; shoppingListId: string }) => void;
  updateShoppingList: (data: { id: string; updates: Partial<ShoppingList> }) => void;

  navigate: (path: string) => void;
  params: { id: string };
  location: {
    pathname: string;
    search: string;
  };
}

interface State {
  currentList: ShoppingList | null;
  currentItems: ShoppingListItem[];
  isItemModalOpen: boolean;
  editingItem: ShoppingListItem | null;
  isEditingListName: boolean;
  editingListName: string;
  shareEmail: string;
  sortOption: SortOption;
  isSortDropdownOpen: boolean;
}

class ListDetailPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentList: null,
      currentItems: [],
      isItemModalOpen: false,
      editingItem: null,
      isEditingListName: false,
      editingListName: '',
      shareEmail: '',
      sortOption: 'newest',
      isSortDropdownOpen: false,
    };
  }

  componentDidMount() {
    const listId = this.props.params.id;
    if (listId) {
      this.props.fetchItems(listId);
      this.loadListData();
      this.updateStateFromURL();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.lists !== this.props.lists || prevProps.items !== this.props.items) {
      this.loadListData();
    }
    
    if (prevProps.location.search !== this.props.location.search) {
      this.updateStateFromURL();
    }
  }

  loadListData = () => {
    const listId = this.props.params.id;
    const list = this.props.lists.find(l => l.id === listId);
    const allItems = this.props.items[listId] || [];
    

    const validItems = allItems.filter(item => 
      item.name && 
      item.name.trim() !== '' && 
      item.quantity !== undefined && 
      item.quantity !== null && 
      item.category && 
      item.category.trim() !== ''

    );
    
    if (list) {
      this.setState({
        currentList: list,
        currentItems: validItems,
        editingListName: list.name,
      });
    }
  };

  handleBackToHome = () => {
    this.props.navigate('/home');
  };

  handleAddItem = () => {
    this.setState({ isItemModalOpen: true, editingItem: null });
  };

  handleEditItem = (item: ShoppingListItem) => {
    this.setState({ isItemModalOpen: true, editingItem: item });
  };

  handleCloseItemModal = () => {
    this.setState({ isItemModalOpen: false, editingItem: null });
  };

  handleItemSubmit = async (itemData: {
    name: string;
    quantity: number;
    notes: string;
    category: string;
    image?: string;
  }) => {
    const { editingItem } = this.state;
    const listId = this.props.params.id;

    if (editingItem) {
      await this.props.updateItem({
        id: editingItem.id,
        updates: {
          ...itemData,
          shoppingListId: listId,
        },
      });

    } else {
      await this.props.createItem({
        ...itemData,
        shoppingListId: listId,
        completed: false,
      });

    }

    this.setState({ isItemModalOpen: false, editingItem: null });
  };

  handleDeleteItem = async (itemId: string) => {
    const listId = this.props.params.id;
    await this.props.deleteItem({ id: itemId, shoppingListId: listId });

  };



  handleQuantityChange = async (item: ShoppingListItem, newQuantity: number) => {
    if (newQuantity > 0) {
      await this.props.updateItem({
        id: item.id,
        updates: { quantity: newQuantity },
      });
    }
  };

  handleQuantityInputChange = async (item: ShoppingListItem, event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value) || 1;
    if (newQuantity > 0) {
      await this.props.updateItem({
        id: item.id,
        updates: { quantity: newQuantity },
      });
    }
  };

  handleEditListName = () => {
    this.setState({ isEditingListName: true });
  };

  handleSaveListName = async () => {
    const { currentList, editingListName } = this.state;
    if (currentList && editingListName.trim()) {
      await this.props.updateShoppingList({
        id: currentList.id,
        updates: { name: editingListName.trim() },
      });
      this.setState({ isEditingListName: false });

    }
  };

  handleCancelEditListName = () => {
    const { currentList } = this.state;
    this.setState({
      isEditingListName: false,
      editingListName: currentList?.name || '',
    });
  };

  handleShareList = async () => {
    const { currentList, shareEmail } = this.state;
    if (currentList && shareEmail.trim()) {
      const updatedSharedWith = [...(currentList.sharedWith || []), shareEmail.trim()];
      await this.props.updateShoppingList({
        id: currentList.id,
        updates: {
          isShared: true,
          sharedWith: updatedSharedWith,
        },
      });
      this.setState({ shareEmail: '' });

    }
  };

  getSortOptionLabel = (option: SortOption): string => {
    switch (option) {
      case 'newest': return 'Newest First';
      case 'oldest': return 'Oldest First';
      case 'name-asc': return 'Name A-Z';
      case 'name-desc': return 'Name Z-A';
      case 'category-asc': return 'Category A-Z';
      case 'category-desc': return 'Category Z-A';
      default: return 'Newest First';
    }
  };

  getSortOptionIcon = (option: SortOption): string => {
    switch (option) {
      case 'newest': return descendingIcon;
      case 'oldest': return ascendingIcon;
      case 'name-asc': return ascendingIcon;
      case 'name-desc': return descendingIcon;
      case 'category-asc': return ascendingIcon;
      case 'category-desc': return descendingIcon;
      default: return descendingIcon;
    }
  };

  updateStateFromURL = () => {
    const params = new URLSearchParams(this.props.location.search);
    const sortParam = params.get('sort') || 'newest';
    
    const validSortOptions: SortOption[] = ['newest', 'oldest', 'name-asc', 'name-desc', 'category-asc', 'category-desc'];
    const sortOption = validSortOptions.includes(sortParam as SortOption) ? sortParam as SortOption : 'newest';
    
    if (sortOption !== this.state.sortOption) {
      this.setState({ sortOption });
    }
  };

  updateURLFromState = () => {
    const params = new URLSearchParams();
    if (this.state.sortOption !== 'newest') {
      params.set('sort', this.state.sortOption);
    }
    
    const newSearch = params.toString();
    const currentSearch = this.props.location.search.slice(1);
    
    if (newSearch !== currentSearch) {
      const newURL = `${this.props.location.pathname}${newSearch ? `?${newSearch}` : ''}`;
      this.props.navigate(newURL);
    }
  };

  handleSortChange = (option: SortOption) => {
    this.setState({ sortOption: option, isSortDropdownOpen: false }, () => {
      this.updateURLFromState();
    });
  };

  sortItems = (items: ShoppingListItem[]): ShoppingListItem[] => {
    const { sortOption } = this.state;
    const sortedItems = [...items];
    
    sortedItems.sort((a, b) => {
      switch (sortOption) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'category-asc':
          return a.category.localeCompare(b.category);
        case 'category-desc':
          return b.category.localeCompare(a.category);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    
    return sortedItems;
  };

  render() {
    const { user } = this.props;
    const {
      currentList,
      currentItems,
      isItemModalOpen,
      editingItem,
      isEditingListName,
      editingListName,
      shareEmail,
      sortOption,
      isSortDropdownOpen,
    } = this.state;

    const userName = user ? user.firstName : 'User';
    const sortedItems = this.sortItems(currentItems);

    if (!currentList) {
      return (
        <div className={styles.container}>
          <Header userName={userName} showNavigation={true} />
          <main className={styles.main}>
            <div className={styles.content}>
              <p>Loading...</p>
            </div>
          </main>
        </div>
      );
    }

    return (
      <div className={styles.container}>
        <Header userName={userName} showNavigation={true} />
        
        <main className={styles.main}>
          <div className={styles.content}>
            <div className={styles.pageHeader}>
              <Button variant="secondary" onClick={this.handleBackToHome}>
                Back to Lists
              </Button>
              
              <div className={styles.listHeader}>
                {isEditingListName ? (
                  <div className={styles.editNameContainer}>
                    <Input
                      value={editingListName}
                      onChange={(e) => this.setState({ editingListName: e.target.value })}
                      placeholder="List name"
                    />
                    <div className={styles.editActions}>
                      <Button onClick={this.handleSaveListName}>Save</Button>
                      <Button variant="secondary" onClick={this.handleCancelEditListName}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.listTitleContainer}>
                    <h1 className={styles.listTitle}>{currentList.name}</h1>
                    <button className={styles.editButton} onClick={this.handleEditListName}>
                      <img src={plusIcon} alt="Edit" style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                )}
                
                <p className={styles.listMeta}>
                  {currentItems.length} items
                </p>
              </div>
              
              <Button onClick={this.handleAddItem}>
                <img src={plusIcon} alt="Add" style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                Add Item
              </Button>
            </div>

            {currentItems.length > 0 && (
              <div className={styles.sortSection}>
                <div className={styles.sortContainer}>
                  <button
                    className={styles.sortButton}
                    onClick={() => this.setState({ isSortDropdownOpen: !isSortDropdownOpen })}
                  >
                    <img src={this.getSortOptionIcon(sortOption)} alt="Sort" className={styles.sortIcon} />
                    <span className={styles.sortLabel}>{this.getSortOptionLabel(sortOption)}</span>
                    <span className={styles.dropdownArrow}>▼</span>
                  </button>

                  {isSortDropdownOpen && (
                    <div className={styles.sortDropdown}>
                      {(['newest', 'oldest', 'name-asc', 'name-desc', 'category-asc', 'category-desc'] as SortOption[]).map((option) => (
                        <button
                          key={option}
                          className={`${styles.sortOption} ${sortOption === option ? styles.active : ''}`}
                          onClick={() => this.handleSortChange(option)}
                        >
                          <img src={this.getSortOptionIcon(option)} alt="Sort" className={styles.sortOptionIcon} />
                          <span>{this.getSortOptionLabel(option)}</span>
                          {sortOption === option && (
                            <img src={closeIcon} alt="Selected" className={styles.checkmark} style={{ width: '16px', height: '16px', transform: 'rotate(45deg)' }} />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className={styles.shareSection}>
              <div className={styles.shareContainer}>
                <Input
                  label="Share this list"
                  placeholder="Enter email address"
                  value={shareEmail}
                  onChange={(e) => this.setState({ shareEmail: e.target.value })}
                />
                <Button onClick={this.handleShareList} disabled={!shareEmail.trim()}>
                  Share
                </Button>
              </div>
              {currentList.sharedWith && currentList.sharedWith.length > 0 && (
                <div className={styles.sharedWith}>
                  <p>Shared with: {currentList.sharedWith.join(', ')}</p>
                </div>
              )}
            </div>

            {currentItems.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <img src={plusIcon} alt="Add item" style={{ width: '64px', height: '64px', opacity: 0.5 }} />
                </div>
                <h3 className={styles.emptyTitle}>No items in this list yet</h3>
                <p className={styles.emptyDescription}>
                  Add your first item to start organizing your shopping.
                </p>
                <Button onClick={this.handleAddItem}>Add Your First Item</Button>
              </div>
            ) : (
              <div className={styles.itemsSection}>
                <div className={styles.itemsGroup}>
                  <h3 className={styles.groupTitle}>Items ({sortedItems.length})</h3>
                  <div className={styles.itemsList}>
                    {sortedItems.map((item) => (
                      <div key={item.id} className={styles.itemCard}>
                        <div className={styles.itemHeader}>
                          <div className={styles.itemInfo}>
                            <h4 
                              className={styles.itemName}
                              onClick={() => this.handleEditItem(item)}
                              style={{ cursor: 'pointer' }}
                            >
                              {item.name}
                            </h4>
                            <p className={styles.itemCategory}>{item.category}</p>
                            {item.notes && <p className={styles.itemNotes}>{item.notes}</p>}
                          </div>
                          <div className={styles.itemActions}>
                            <div className={styles.quantityContainer}>
                              <label className={styles.quantityLabel}>Quantity:</label>
                              <span className={styles.quantityDisplay}>{item.quantity}</span>
                            </div>
                            {item.image && (
                              <div className={styles.itemImageContainer}>
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className={styles.itemImage}
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                            <button
                              className={styles.deleteButton}
                              onClick={() => this.handleDeleteItem(item.id)}
                            >
                              <img src={closeIcon} alt="Delete" style={{ width: '16px', height: '16px' }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <ItemModal
          isOpen={isItemModalOpen}
          onClose={this.handleCloseItemModal}
          onSubmit={this.handleItemSubmit}
          item={editingItem}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
  lists: state.shoppingLists.lists,
  items: state.shoppingLists.items,
  loading: state.shoppingLists.loading,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  fetchItems: (listId: string) => dispatch(fetchItems(listId)),
  createItem: (item: Omit<ShoppingListItem, 'id' | 'createdAt' | 'updatedAt'>) => dispatch(createItem(item)),
  updateItem: (data: { id: string; updates: Partial<ShoppingListItem> }) => dispatch(updateItem(data)),
  deleteItem: (data: { id: string; shoppingListId: string }) => dispatch(deleteItem(data)),
  updateShoppingList: (data: { id: string; updates: Partial<ShoppingList> }) => dispatch(updateShoppingList(data)),

});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ListDetailPage));