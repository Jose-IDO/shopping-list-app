import React, { useState } from 'react';
import styles from './HomePage.module.css';
import Header from '../components/Header/Header';
import Button from '../components/Button/Button';
import CreateModal from '../components/CreateModal/CreateModal';
import cartIcon from '../assets/shopping-cart.png';

const HomePage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [shoppingLists, setShoppingLists] = useState<any[]>([]);

 
  const userName = "Joseph";

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

  return (
    <div className={styles.container}>
      <Header 
        userName={userName} 
        showNavigation={true} 
      />
      
      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.pageHeader}>
            <h2 className={styles.pageTitle}>My Shopping Lists</h2>
            <Button onClick={handleCreateNewList}>
              Create New List
            </Button>
          </div>

          {shoppingLists.length === 0 ? (
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
              {shoppingLists.map((list) => (
                <div key={list.id} className={styles.listCard}>
                  <div className={styles.listHeader}>
                    <h3 className={styles.listTitle}>{list.name}</h3>
                    <span className={styles.itemCount}>
                      {list.itemCount || 0} items
                    </span>
                  </div>
                  <div className={styles.listActions}>
                    <Button 
                      variant="primary" 
                      onClick={() => handleViewList(list.id)}
                    >
                      View List
                    </Button>
                    <Button 
                      variant="secondary" 
                      onClick={() => handleDeleteList(list.id)}
                    >
                      Delete
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