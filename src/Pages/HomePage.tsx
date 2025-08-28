import React, { useState } from 'react';
import styles from './HomePage.module.css';
import Header from '../components/Header/Header';
import Button from '../components/Button/Button';
import CreateModal from '../components/CreateModal/CreateModal';
import cartIcon from '../assets/shopping-cart.png';
import filterIcon from '../assets/filter.png';
import descendingSortIcon from '../assets/descending-sort.png';
import ascendingSortIcon from '../assets/ascending-sort.png';


type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc';

interface ShoppingList {
  id: string;
  name: string;
  itemCount: number;
  createdAt: string;
}

const HomePage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);


  const userName = "Joseph";


  const sampleLists: ShoppingList[] = [
    {
      id: '1',
      name: 'Weekly Groceries',
      itemCount: 0,
      createdAt: '2025-08-26'
    }
  ];

  const handleCreateNewList = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleListCreated = (listData: any) => {

    console.log('Creating new list:', listData);
    

    
    setIsCreateModalOpen(false);
  };

  const handleViewList = (listId: string) => {

    console.log('Viewing list:', listId);
  };

  const handleDeleteList = (listId: string) => {

    console.log('Deleting list:', listId);
  };


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);

  };


  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    setIsSortDropdownOpen(false);

  };

  const getSortOptionLabel = (option: SortOption) => {
    switch (option) {
      case 'newest': return 'Newest First';
      case 'oldest': return 'Oldest First';
      case 'name-asc': return 'Name A-Z';
      case 'name-desc': return 'Name Z-A';
    }
  };

  const getSortOptionIcon = (option: SortOption) => {
    switch (option) {
      case 'newest': return descendingSortIcon;
      case 'oldest': return ascendingSortIcon;
      case 'name-asc': return ascendingSortIcon;
      case 'name-desc': return descendingSortIcon;
    }
  };


  const displayLists = shoppingLists.length > 0 ? shoppingLists : sampleLists;
  const listCount = displayLists.length;

  return (
    <div className={styles.container}>
      <Header 
        userName={userName} 
        showNavigation={true} 
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
            <Button onClick={handleCreateNewList}>
              + New List
            </Button>
          </div>

          <div className={styles.controls}>
            <div className={styles.searchContainer}>
              <img src={filterIcon} alt="Search" className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search lists and items..."
                value={searchQuery}
                onChange={handleSearchChange}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.sortContainer}>
              <button
                className={styles.sortButton}
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              >
                <img 
                  src={getSortOptionIcon(sortOption)} 
                  alt="Sort" 
                  className={styles.sortIcon}
                />
                <span className={styles.sortLabel}>{getSortOptionLabel(sortOption)}</span>
                <span className={styles.dropdownArrow}>▼</span>
              </button>

              {isSortDropdownOpen && (
                <div className={styles.sortDropdown}>
                  {(['newest', 'oldest', 'name-asc', 'name-desc'] as SortOption[]).map((option) => (
                    <button
                      key={option}
                      className={`${styles.sortOption} ${sortOption === option ? styles.active : ''}`}
                      onClick={() => handleSortChange(option)}
                    >
                      <img 
                        src={getSortOptionIcon(option)} 
                        alt="Sort" 
                        className={styles.sortOptionIcon}
                      />
                      <span>{getSortOptionLabel(option)}</span>
                      {sortOption === option && (
                        <span className={styles.checkmark}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {displayLists.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <img src={cartIcon} alt="Shopping cart" width="64" height="64" />
              </div>
              <h3 className={styles.emptyTitle}>No shopping lists yet</h3>
              <p className={styles.emptyDescription}>
                Create your first shopping list to get started organizing your shopping.
              </p>
              <Button onClick={handleCreateNewList}>
                Create Your First List
              </Button>
            </div>
          ) : (
            <div className={styles.listsGrid}>
              {displayLists.map((list) => (
                <div key={list.id} className={styles.listCard}>
                  <div className={styles.listHeader}>
                    <h3 className={styles.listTitle}>{list.name}</h3>
                    <button className={styles.listMenu}>⋮</button>
                  </div>
                  <div className={styles.listMeta}>
                    <span className={styles.itemCount}>
                      {list.itemCount} items
                    </span>
                    <span className={styles.listDate}>{list.createdAt}</span>
                  </div>
                  <div className={styles.listActions}>
                    <Button 
                      variant="secondary" 
                      onClick={() => handleViewList(list.id)}
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
        onClose={handleCloseModal}
        onSubmit={handleListCreated}
      />
    </div>
  );
};

export default HomePage;