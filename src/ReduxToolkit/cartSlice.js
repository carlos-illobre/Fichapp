import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
  subtotal: 0,
  discount: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const evento = action.payload;
      const item = state.cartItems.find((item) => item.id === evento.id);

      if (item) {
        const nuevaCantidad = item.cantidad + evento.cantidad;
        state.cartItems = [
          ...state.cartItems.filter((item) => item.id !== evento.id),
          { ...evento, cantidad: nuevaCantidad },
        ];
      } else {
        state.cartItems.push({ ...evento });
      }
      state.subtotal = state.cartItems.reduce((total, item) => {
        return total + item.new_price * item.cantidad;
      }, 0);
      state.total=  state.subtotal - state.discount;
    },
    removeFromCart(state, action) {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
      state.subtotal = state.cartItems.reduce((total, item) => {
        return total + item.new_price * item.cantidad;
      }, 0);
      state.total=  state.subtotal - state.discount ;
    },
    removeAllFromCart(state) {
      state.cartItems = [];
      state.subtotal = 0;
      state.discount = 0;
      state.total = 0;
    },
    applyPromoCode(state, action) {
        const promoCode = action.payload;
        if (promoCode === "1234") {
          state.discount = state.subtotal * 0.1;
        } else {
          state.discount = 0;
        }
        state.total =  state.subtotal - state.discount ;
      },
  },
});

// Selector para calcular el total del carrito
export const selectTotalCartAmount = state => state.cart.total;
export const selectSubtotal = state => state.cart.subtotal;
export const selectDiscount = state => state.cart.discount;


// Selector para calcular el número total de elementos en el carrito
export const selectTotalCartItems = createSelector(
  state => state.cart.cartItems,
  (cartItems) => {
    let cantEntradas = 0;
    cartItems.forEach((item) => {
      cantEntradas += item.cantidad;
    });
    return cantEntradas;
  }
);
export const selectCartItems = state => state.cart.cartItems;

export const { addToCart, removeFromCart, removeAllFromCart, applyPromoCode } = cartSlice.actions;

export default cartSlice.reducer;
