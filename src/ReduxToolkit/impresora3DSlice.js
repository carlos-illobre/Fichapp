import { createSlice } from '@reduxjs/toolkit';

// Estado inicial
const initialState = {
  impresoras: [],
  isLoading: false,
  error: null,
};

// Slice de impresoras 3D
const impresora3DSlice = createSlice({
  name: 'impresora3D',
  initialState,
  reducers: {
    // Acción para comenzar a cargar impresoras
    startLoadingImpresoras: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    // Acción para agregar una impresora
    addImpresora: (state, action) => {
      state.impresoras.push(action.payload);
      state.isLoading = false;
    },
    // Acción para manejar errores
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    // Acción para finalizar la carga de impresoras
    finishLoading: (state) => {
      state.isLoading = false;
    },
  },
});

// Exportar las acciones y el reducer
export const { startLoadingImpresoras, addImpresora, setError, finishLoading } = impresora3DSlice.actions;
export default impresora3DSlice.reducer;
