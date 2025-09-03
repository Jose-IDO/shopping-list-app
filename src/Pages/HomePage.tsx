import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from '../utils/withRouter';
import { RootState, AppDispatch } from '../store';
import { fetchShoppingLists, createShoppingList, deleteShoppingList } from '../store/slices/shoppingListSlice';
import { setSearchQuery, setSortOption, setCreateModalOpen, SortOption } from '../store/slices/uiSlice';
import { logout } from '../store/slices/authSlice';
import styles from './HomePage.module.css';
import Header from '../components/Header/Header';
import Button from '../components/Button/Button';
import CreateModal from '../components/CreateModal/CreateModal';
import searchIcon from '../assets/filter.png';
import shoppingCartIcon from '../assets/shopping-cart.png';
import plusIcon from '../assets/plus.png';
import ascendingIcon from '../assets/ascending-sort.png';
import descendingIcon from '../assets/descending-sort.png';
import closeIcon from '../assets/close.png';

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
  items: { [listId: string]: any[] };
  searchQuery: string;
  sortOption: SortOption;
  isCreateModalOpen: boolean;
  loading: boolean;
  fetchShoppingLists: (userId: string) => void;
  createShoppingList: (data: { name: string; userId: string }) => void;
  deleteShoppingList: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSortOption: (option: SortOption) => void;
  setCreateModalOpen: (isOpen: boolean) => void;

  logout: () => void;
  navigate: (path: string) => void;
  location: {
    pathname: string;
    search: string;
  };
}

interface State {
  isSortDropdownOpen: boolean;
  filteredLists: ShoppingList[];
}

class HomePage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isSortDropdownOpen: false,
      filteredLists: [],
    };
  }

  componentDidMount() {
    if (this.props.user) {
      this.props.fetchShoppingLists(this.props.user.id);
    }
    this.updateStateFromURL();
  }

  componentWillUnmount() {

  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.lists !== this.props.lists || 
        prevProps.searchQuery !== this.props.searchQuery || 
        prevProps.sortOption !== this.props.sortOption ||
        prevProps.items !== this.props.items) {
      this.filterAndSortLists();
    }
    
    if (prevProps.location.search !== this.props.location.search) {
      this.updateStateFromURL();
    }
  }

  updateURLFromState = () => {
    const params = new URLSearchParams();
    if (this.props.searchQuery) params.set('search', this.props.searchQuery);
    if (this.props.sortOption !== 'newest') params.set('sort', this.props.sortOption);
    
    const newSearch = params.toString();
    const currentSearch = this.props.location.search.slice(1);
    
    if (newSearch !== currentSearch) {
      this.props.navigate(`${this.props.location.pathname}?${newSearch}`);
    }
  };

  updateStateFromURL = () => {
    const params = new URLSearchParams(this.props.location.search);
    const searchQuery = params.get('search') || '';
    const sortParam = params.get('sort') || 'newest';
    
    const validSortOptions: SortOption[] = ['newest', 'oldest', 'name-asc', 'name-desc', 'category-asc', 'category-desc'];
    const sortOption = validSortOptions.includes(sortParam as SortOption) ? sortParam as SortOption : 'newest';
    
    if (searchQuery !== this.props.searchQuery) {
      this.props.setSearchQuery(searchQuery);
    }
    if (sortOption !== this.props.sortOption) {
      this.props.setSortOption(sortOption);
    }
  };

  getListCategory = (list: ShoppingList): string => {
    const items = this.props.items[list.id] || [];
    if (items.length === 0) {
      return 'Other';
    }
    

    const categoryCount: { [key: string]: number } = {};
    items.forEach(item => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    });
    

    const mostCommonCategory = Object.keys(categoryCount).reduce((a, b) => 
      categoryCount[a] > categoryCount[b] ? a : b
    );
    
    return mostCommonCategory;
  };

  filterAndSortLists = () => {
    let filtered = [...this.props.lists];

    if (this.props.searchQuery) {
      filtered = filtered.filter(list => 
        list.name.toLowerCase().includes(this.props.searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      switch (this.props.sortOption) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'category-asc':
          return this.getListCategory(a).localeCompare(this.getListCategory(b));
        case 'category-desc':
          return this.getListCategory(b).localeCompare(this.getListCategory(a));
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    this.setState({ filteredLists: filtered });
  };

  handleCreateNewList = () => {
    this.props.setCreateModalOpen(true);
  };

  handleCloseModal = () => {
    this.props.setCreateModalOpen(false);
  };

  handleListCreated = async (listData: { listName: string }) => {
    if (this.props.user) {
      await this.props.createShoppingList({
        name: listData.listName,
        userId: this.props.user.id,
      });

    }
    this.props.setCreateModalOpen(false);
  };

  handleViewList = (listId: string) => {
    this.props.navigate(`/list/${listId}`);
  };

  handleDeleteList = async (listId: string) => {
    try {

      this.setState(prevState => ({
        ...prevState,
        filteredLists: prevState.filteredLists.filter(list => list.id !== listId)
      }));
      

      await this.props.deleteShoppingList(listId);
    } catch (error) {
      console.error('Failed to delete list:', error);

      this.filterAndSortLists();
    }
  };



  handleLogout = () => {

    this.props.logout();

    localStorage.removeItem('persist:root');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('users');

    this.props.navigate('/login');
  };

  handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.setSearchQuery(e.target.value);
    this.updateURLFromState();
  };

  handleSortChange = (option: SortOption) => {
    this.props.setSortOption(option);
    this.setState({ isSortDropdownOpen: false });
    this.updateURLFromState();
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

  render() {
    const { user, isCreateModalOpen } = this.props;
    const { filteredLists, isSortDropdownOpen } = this.state;
    const listCount = filteredLists.length;
    const userName = user ? user.firstName : 'User';

    return (
      <div className={styles.container}>
        <Header 
          userName={userName} 
          showNavigation={true}
          onLogout={this.handleLogout}
        />
        
        <main className={styles.main}>
          <div className={styles.content}>
            <div className={styles.pageHeader}>
              <div className={styles.headerText}>
                <h2 className={styles.pageTitle}>My Shopping Lists</h2>
                <p className={styles.listCount}>
                  You have {listCount} shopping {listCount === 1 ? 'list' : 'lists'}
                </p>
              </div>
              <Button onClick={this.handleCreateNewList}>
                <img src={plusIcon} alt="Add" style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                New List
              </Button>
            </div>

            <div className={styles.controls}>
              <div className={styles.searchContainer}>
                <img src={searchIcon} alt="Search" className={styles.searchIcon} style={{ width: '16px', height: '16px' }} />
                <input
                  type="text"
                  placeholder="Search lists and items..."
                  value={this.props.searchQuery}
                  onChange={this.handleSearchChange}
                  className={styles.searchInput}
                />
              </div>

              <div className={styles.sortContainer}>
                <button
                  className={styles.sortButton}
                  onClick={() => this.setState({ isSortDropdownOpen: !isSortDropdownOpen })}
                >
                  <img src={this.getSortOptionIcon(this.props.sortOption)} alt="Sort" className={styles.sortIcon} />
                  <span className={styles.sortLabel}>{this.getSortOptionLabel(this.props.sortOption)}</span>
                  <span className={styles.dropdownArrow}>▼</span>
                </button>

                {isSortDropdownOpen && (
                  <div className={styles.sortDropdown}>
                    {(['newest', 'oldest', 'name-asc', 'name-desc', 'category-asc', 'category-desc'] as SortOption[]).map((option) => (
                      <button
                        key={option}
                        className={`${styles.sortOption} ${this.props.sortOption === option ? styles.active : ''}`}
                        onClick={() => this.handleSortChange(option)}
                      >
                        <img src={this.getSortOptionIcon(option)} alt="Sort" className={styles.sortOptionIcon} />
                        <span>{this.getSortOptionLabel(option)}</span>
                        {this.props.sortOption === option && (
                          <img src={closeIcon} alt="Selected" className={styles.checkmark} style={{ width: '16px', height: '16px', transform: 'rotate(45deg)' }} />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {filteredLists.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <img src={shoppingCartIcon} alt="Shopping Cart" style={{ width: '64px', height: '64px' }} />
                </div>
                <h3 className={styles.emptyTitle}>
                  {this.props.searchQuery ? 'No matching lists found' : 'No shopping lists yet'}
                </h3>
                <p className={styles.emptyDescription}>
                  {this.props.searchQuery 
                    ? 'Try adjusting your search terms or create a new list.'
                    : 'Create your first shopping list to get started organizing your shopping.'
                  }
                </p>
                <Button onClick={this.handleCreateNewList}>
                  {this.props.searchQuery ? 'Create New List' : 'Create Your First List'}
                </Button>
              </div>
            ) : (
              <div className={styles.listsGrid}>
                {filteredLists.map((list) => (
                  <div key={list.id} className={styles.listCard}>
                    <div className={styles.listHeader}>
                      <h3 className={styles.listTitle}>{list.name}</h3>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => this.handleDeleteList(list.id)}
                      >
                        Delete
                      </button>
                    </div>
                    <div className={styles.listMeta}>
                      <span className={styles.itemCount}>
                        {list.itemCount} items
                      </span>
                      <span className={styles.listDate}>
                        {new Date(list.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={styles.listActions}>
                      <Button 
                        variant="secondary" 
                        onClick={() => this.handleViewList(list.id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
        
        <CreateModal
          isOpen={isCreateModalOpen}
          onClose={this.handleCloseModal}
          onSubmit={this.handleListCreated}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.auth.user,
  lists: state.shoppingLists.lists,
  items: state.shoppingLists.items,
  searchQuery: state.ui.searchQuery,
  sortOption: state.ui.sortOption,
  isCreateModalOpen: state.ui.isCreateModalOpen,
  loading: state.shoppingLists.loading,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  fetchShoppingLists: (userId: string) => dispatch(fetchShoppingLists(userId)),
  createShoppingList: (data: { name: string; userId: string }) => dispatch(createShoppingList(data)),
  deleteShoppingList: (id: string) => dispatch(deleteShoppingList(id)),
  setSearchQuery: (query: string) => dispatch(setSearchQuery(query)),
  setSortOption: (option: SortOption) => dispatch(setSortOption(option)),
  setCreateModalOpen: (isOpen: boolean) => dispatch(setCreateModalOpen(isOpen)),

  logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HomePage));