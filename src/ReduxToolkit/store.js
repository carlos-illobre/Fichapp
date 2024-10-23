import { configureStore} from '@reduxjs/toolkit';
import partyReducer from './partySlice';
import userReducer from './userSlice';
import cartReducer from './cartSlice';
import impresora3DReducer from './impresora3DSlice';

const store = configureStore({
  reducer: {
    party: partyReducer,
    user: userReducer,
    cart: cartReducer,
    impresora3D: impresora3DReducer
  },
});

export default store;
