import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { normalizeId, normalizeEntityIds } from '../../utils/idValidation';

export interface ShoppingListItem {
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

export interface ShoppingList {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  itemCount: number;
  isShared: boolean;
  sharedWith: string[];
}

interface ShoppingListState {
  lists: ShoppingList[];
  items: { [listId: string]: ShoppingListItem[] };
  loading: boolean;
  error: string | null;
}

const initialState: ShoppingListState = {
  lists: [],
  items: {},
  loading: false,
  error: null,
};

export const fetchShoppingLists = createAsyncThunk(
  'shoppingLists/fetchLists',
  async (userId: string) => {
    const response = await api.get(`/shoppingLists?userId=${normalizeId(userId)}`);

    return response.data.map(normalizeEntityIds.shoppingList);
  }
);

export const createShoppingList = createAsyncThunk(
  'shoppingLists/createList',
  async ({ name, userId }: { name: string; userId: string }) => {
    const newList = {
      name,
      userId: normalizeId(userId),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      itemCount: 0,
      isShared: false,
      sharedWith: [],
    };
    const response = await api.post('/shoppingLists', newList);

    return normalizeEntityIds.shoppingList(response.data);
  }
);

export const updateShoppingList = createAsyncThunk(
  'shoppingLists/updateList',
  async ({ id, updates }: { id: string; updates: Partial<ShoppingList> }) => {
    const updatedList = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    const response = await api.put(`/shoppingLists/${normalizeId(id)}`, updatedList);

    return normalizeEntityIds.shoppingList(response.data);
  }
);

export const deleteShoppingList = createAsyncThunk(
  'shoppingLists/deleteList',
  async (id: string) => {
    const normalizedId = normalizeId(id);
    await api.delete(`/shoppingLists/${normalizedId}`);
    await api.delete(`/items?shoppingListId=${normalizedId}`);
    return normalizedId;
  }
);

export const fetchItems = createAsyncThunk(
  'shoppingLists/fetchItems',
  async (listId: string) => {
    const normalizedListId = normalizeId(listId);
    const response = await api.get(`/items?shoppingListId=${normalizedListId}`);

    const normalizedItems = response.data.map(normalizeEntityIds.shoppingListItem);
    return { listId: normalizedListId, items: normalizedItems };
  }
);

export const createItem = createAsyncThunk(
  'shoppingLists/createItem',
  async (itemData: Omit<ShoppingListItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const normalizedShoppingListId = normalizeId(itemData.shoppingListId);
    const newItem = {
      ...itemData,
      shoppingListId: normalizedShoppingListId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const response = await api.post('/items', newItem);
    

    const listResponse = await api.get(`/shoppingLists/${normalizedShoppingListId}`);
    const list = listResponse.data;
    await api.put(`/shoppingLists/${normalizedShoppingListId}`, {
      ...list,
      itemCount: list.itemCount + 1,
      updatedAt: new Date().toISOString(),
    });
    

    return normalizeEntityIds.shoppingListItem(response.data);
  }
);

export const updateItem = createAsyncThunk(
  'shoppingLists/updateItem',
  async ({ id, updates }: { id: string; updates: Partial<ShoppingListItem> }) => {
    const normalizedId = normalizeId(id);
    const updatedItem = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    const response = await api.put(`/items/${normalizedId}`, updatedItem);

    return normalizeEntityIds.shoppingListItem(response.data);
  }
);

export const deleteItem = createAsyncThunk(
  'shoppingLists/deleteItem',
  async ({ id, shoppingListId }: { id: string; shoppingListId: string }) => {
    const normalizedId = normalizeId(id);
    const normalizedShoppingListId = normalizeId(shoppingListId);
    
    await api.delete(`/items/${normalizedId}`);
    

    const listResponse = await api.get(`/shoppingLists/${normalizedShoppingListId}`);
    const list = listResponse.data;
    await api.put(`/shoppingLists/${normalizedShoppingListId}`, {
      ...list,
      itemCount: Math.max(0, list.itemCount - 1),
      updatedAt: new Date().toISOString(),
    });
    
    return { id: normalizedId, shoppingListId: normalizedShoppingListId };
  }
);

const shoppingListSlice = createSlice({
  name: 'shoppingLists',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchShoppingLists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShoppingLists.fulfilled, (state, action) => {
        state.loading = false;
        state.lists = action.payload;
      })
      .addCase(fetchShoppingLists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch shopping lists';
      })
      

      .addCase(createShoppingList.fulfilled, (state, action) => {
        state.lists.push(action.payload);
      })
      

      .addCase(updateShoppingList.fulfilled, (state, action) => {
        const index = state.lists.findIndex(list => list.id === action.payload.id);
        if (index !== -1) {
          state.lists[index] = action.payload;
        }
      })
      

      .addCase(deleteShoppingList.fulfilled, (state, action) => {
        state.lists = state.lists.filter(list => list.id !== action.payload);
        delete state.items[action.payload];
      })
      

      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items[action.payload.listId] = action.payload.items;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch items';
      })
      

      .addCase(createItem.fulfilled, (state, action) => {
        const listId = action.payload.shoppingListId;
        if (!state.items[listId]) {
          state.items[listId] = [];
        }
        state.items[listId].push(action.payload);
      })
      

      .addCase(updateItem.fulfilled, (state, action) => {
        const listId = action.payload.shoppingListId;
        if (state.items[listId]) {
          const index = state.items[listId].findIndex(item => item.id === action.payload.id);
          if (index !== -1) {
            state.items[listId][index] = action.payload;
          }
        }
      })
      

      .addCase(deleteItem.fulfilled, (state, action) => {
        const { id, shoppingListId } = action.payload;
        if (state.items[shoppingListId]) {
          state.items[shoppingListId] = state.items[shoppingListId].filter(item => item.id !== id);
        }
      });
  },
});

export const { clearError } = shoppingListSlice.actions;
export default shoppingListSlice.reducer;