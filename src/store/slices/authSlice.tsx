import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bcrypt from 'bcryptjs';
import api from '../../services/api';
import { normalizeEntityIds } from '../../utils/idValidation';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  cellNumber: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    cellNumber: string;
  }) => {
    const existingUsers = await api.get('/users?email=' + userData.email);
    if (existingUsers.data.length > 0) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      cellNumber: userData.cellNumber,
      password: hashedPassword,
    };

    const response = await api.post('/users', newUser);

    return normalizeEntityIds.user(response.data);
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await api.get('/users?email=' + credentials.email);
    if (response.data.length === 0) {
      throw new Error('Invalid email or password');
    }

    const user = response.data[0];
    const passwordMatch = await bcrypt.compare(credentials.password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid email or password');
    }

    const { password, ...userWithoutPassword } = user;

    return normalizeEntityIds.user(userWithoutPassword);
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: Partial<User>, { getState }) => {
    const state = getState() as { auth: AuthState };
    if (!state.auth.user) {
      throw new Error('No user logged in');
    }

    const updatedUser = { ...state.auth.user, ...profileData };
    const response = await api.put(`/users/${state.auth.user.id}`, {
      ...updatedUser,
      password: (await api.get(`/users/${state.auth.user.id}`)).data.password
    });
    
    const { password, ...userWithoutPassword } = response.data;

    return normalizeEntityIds.user(userWithoutPassword);
  }
);


export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (
    args: { currentPassword: string; newPassword: string },
    { getState }
  ) => {
    const state = getState() as { auth: AuthState };
    if (!state.auth.user) {
      throw new Error('No user logged in');
    }


    const existing = await api.get(`/users/${state.auth.user.id}`);
    const userWithPassword = existing.data;

    const ok = await bcrypt.compare(args.currentPassword, userWithPassword.password);
    if (!ok) {
      throw new Error('Current password is incorrect');
    }

    const newHashed = await bcrypt.hash(args.newPassword, 10);
    const updated = {
      ...userWithPassword,
      password: newHashed,
    };

    const response = await api.put(`/users/${state.auth.user.id}`, updated);

    const { password, ...userWithoutPassword } = response.data;

    return normalizeEntityIds.user(userWithoutPassword);
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Profile update failed';
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Password change failed';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;