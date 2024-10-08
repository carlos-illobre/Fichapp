// src/ReduxToolkit/userSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Acción asincrónica para registrar usuario (puedes dejar esta parte si la necesitas)
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (userData, thunkAPI) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error('Failed to register user');
      }
      const data = await response.json();
      return data.accessToken;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Estado inicial del usuario
const initialState = {
  name: '',
  role: '',
  email: '',
  hashedPassword: '',
  isLogged: false,
};

// Slice de usuario
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.name = action.payload.name;
      state.role = action.payload.role;
      state.email = action.payload.email;
      state.hashedPassword = action.payload.hashedPassword;
      state.isLogged = action.payload.isLogged;
    },
    clearUser: (state) => {
      state.name = '';
      state.role = '';
      state.email = '';
      state.hashedPassword = '';
      state.isLogged = false;
    },
    // Acción para actualizar el nombre del usuario
    updateUser: (state, action) => {
      state.name = action.payload.name || state.name;
      state.phone = action.payload.phone || state.phone;
      // Puedes agregar más campos a actualizar si es necesario
    },
  },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
