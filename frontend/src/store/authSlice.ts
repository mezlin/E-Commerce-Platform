import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthPayload {
  user: User;
  token: string;  
}
interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  isAuthenticated: !!localStorage.getItem('user'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthPayload>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;