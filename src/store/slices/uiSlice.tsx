import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'category-asc' | 'category-desc';

interface UiState {
  searchQuery: string;
  sortOption: SortOption;
  isCreateModalOpen: boolean;
  selectedCategory: string | null;
  notification: {
    message: string;
    type: 'success' | 'error' | 'info';
  } | null;
}

const initialState: UiState = {
  searchQuery: '',
  sortOption: 'newest',
  isCreateModalOpen: false,
  selectedCategory: null,
  notification: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortOption: (state, action: PayloadAction<SortOption>) => {
      state.sortOption = action.payload;
    },
    setCreateModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isCreateModalOpen = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    showNotification: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' }>) => {
      state.notification = action.payload;
    },
    hideNotification: (state) => {
      state.notification = null;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.sortOption = 'newest';
      state.selectedCategory = null;
    },
  },
});

export const {
  setSearchQuery,
  setSortOption,
  setCreateModalOpen,
  setSelectedCategory,
  showNotification,
  hideNotification,
  resetFilters,
} = uiSlice.actions;

export default uiSlice.reducer;