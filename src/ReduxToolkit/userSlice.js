import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, thunkAPI) => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        throw new Error("Failed to register user");
      }
      console.log(response);
      const data = await response.json();
      return data.accessToken;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
    name: "",
    role: "",
    email: "",
    hashedPassword: "",
    isLogged: false,
};

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
      state.name = "";
      state.role = "";
      state.email = "";
      state.hashedPassword = "";
      state.isLogged = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
