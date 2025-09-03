// Mock API service for production deployment
// This simulates the JSON server functionality in the browser

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cellNumber: string;
  password?: string;
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

class MockApiService {
  private storageKey = 'shopping-list-app-data';
  private data: {
    users: User[];
    shoppingLists: ShoppingList[];
    items: ShoppingListItem[];
  };

  constructor() {
    // Load data from localStorage or initialize with default data
    const savedData = localStorage.getItem(this.storageKey);
    if (savedData) {
      this.data = JSON.parse(savedData);
    } else {
      this.data = {
        users: [],
        shoppingLists: [],
        items: []
      };
      this.saveData();
    }
  }

  private saveData() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // User endpoints
  async getUsers(query?: string) {
    if (query && query.includes('email=')) {
      const email = query.split('email=')[1];
      const user = this.data.users.find(u => u.email === email);
      return { data: user ? [user] : [] };
    }
    return { data: this.data.users };
  }

  async getUser(id: string) {
    const user = this.data.users.find(u => u.id === id);
    return { data: user };
  }

  async createUser(userData: Omit<User, 'id'>) {
    const newUser: User = {
      ...userData,
      id: this.generateId()
    };
    this.data.users.push(newUser);
    this.saveData();
    return { data: newUser };
  }

  async updateUser(id: string, userData: Partial<User>) {
    const userIndex = this.data.users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      this.data.users[userIndex] = { ...this.data.users[userIndex], ...userData };
      this.saveData();
      return { data: this.data.users[userIndex] };
    }
    throw new Error('User not found');
  }

  // Shopping Lists endpoints
  async getShoppingLists(query?: string) {
    if (query && query.includes('userId=')) {
      const userId = query.split('userId=')[1];
      const lists = this.data.shoppingLists.filter(l => l.userId === userId);
      return { data: lists };
    }
    return { data: this.data.shoppingLists };
  }

  async getShoppingList(id: string) {
    const list = this.data.shoppingLists.find(l => l.id === id);
    return { data: list };
  }

  async createShoppingList(listData: Omit<ShoppingList, 'id' | 'createdAt' | 'updatedAt' | 'itemCount'>) {
    const newList: ShoppingList = {
      ...listData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      itemCount: 0
    };
    this.data.shoppingLists.push(newList);
    this.saveData();
    return { data: newList };
  }

  async updateShoppingList(id: string, listData: Partial<ShoppingList>) {
    const listIndex = this.data.shoppingLists.findIndex(l => l.id === id);
    if (listIndex !== -1) {
      this.data.shoppingLists[listIndex] = { 
        ...this.data.shoppingLists[listIndex], 
        ...listData,
        updatedAt: new Date().toISOString()
      };
      this.saveData();
      return { data: this.data.shoppingLists[listIndex] };
    }
    throw new Error('Shopping list not found');
  }

  async deleteShoppingList(id: string) {
    const listIndex = this.data.shoppingLists.findIndex(l => l.id === id);
    if (listIndex !== -1) {
      this.data.shoppingLists.splice(listIndex, 1);
      // Also delete all items in this list
      this.data.items = this.data.items.filter(item => item.shoppingListId !== id);
      this.saveData();
      return { data: { id } };
    }
    throw new Error('Shopping list not found');
  }

  // Items endpoints
  async getItems(query?: string) {
    if (query && query.includes('shoppingListId=')) {
      const shoppingListId = query.split('shoppingListId=')[1];
      const items = this.data.items.filter(i => i.shoppingListId === shoppingListId);
      return { data: items };
    }
    return { data: this.data.items };
  }

  async getItemsByListId(listId: string) {
    const items = this.data.items.filter(item => item.shoppingListId === listId);
    return { data: items };
  }

  async getItem(id: string) {
    const item = this.data.items.find(i => i.id === id);
    return { data: item };
  }

  async createItem(itemData: Omit<ShoppingListItem, 'id' | 'createdAt' | 'updatedAt'>) {
    const newItem: ShoppingListItem = {
      ...itemData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.items.push(newItem);
    
    // Update item count for the shopping list
    const listIndex = this.data.shoppingLists.findIndex(l => l.id === itemData.shoppingListId);
    if (listIndex !== -1) {
      this.data.shoppingLists[listIndex].itemCount = this.data.items.filter(i => i.shoppingListId === itemData.shoppingListId).length;
      this.data.shoppingLists[listIndex].updatedAt = new Date().toISOString();
    }
    
    this.saveData();
    return { data: newItem };
  }

  async updateItem(id: string, itemData: Partial<ShoppingListItem>) {
    const itemIndex = this.data.items.findIndex(i => i.id === id);
    if (itemIndex !== -1) {
      this.data.items[itemIndex] = { 
        ...this.data.items[itemIndex], 
        ...itemData,
        updatedAt: new Date().toISOString()
      };
      this.saveData();
      return { data: this.data.items[itemIndex] };
    }
    throw new Error('Item not found');
  }

  async deleteItem(id: string) {
    const itemIndex = this.data.items.findIndex(i => i.id === id);
    if (itemIndex !== -1) {
      const item = this.data.items[itemIndex];
      this.data.items.splice(itemIndex, 1);
      
      // Update item count for the shopping list
      const listIndex = this.data.shoppingLists.findIndex(l => l.id === item.shoppingListId);
      if (listIndex !== -1) {
        this.data.shoppingLists[listIndex].itemCount = this.data.items.filter(i => i.shoppingListId === item.shoppingListId).length;
        this.data.shoppingLists[listIndex].updatedAt = new Date().toISOString();
      }
      
      this.saveData();
      return { data: { id } };
    }
    throw new Error('Item not found');
  }
}

export default new MockApiService();
