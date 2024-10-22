import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase';  // Importa la instancia de Firestore
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

// Thunks asíncronos para interactuar con Firestore

// Obtener todas las piezas desde Firestore
export const fetchPiezas = createAsyncThunk('party/fetchPiezas', async () => {
  const piezasCollection = collection(db, 'piezas');
  const piezasSnapshot = await getDocs(piezasCollection);
  const piezasList = piezasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return piezasList;
});

// Agregar una nueva pieza a Firestore
export const addPieza = createAsyncThunk('party/addPieza', async (newPieza) => {
  const docRef = await addDoc(collection(db, 'piezas'), newPieza);
  return { id: docRef.id, ...newPieza };
});

// Actualizar una pieza existente en Firestore
export const updatePieza = createAsyncThunk('party/updatePieza', async (updatedPieza) => {
  const piezaRef = doc(db, 'piezas', updatedPieza.id);
  await updateDoc(piezaRef, updatedPieza);
  return updatedPieza;
});

// Borrar una pieza de Firestore
export const deletePieza = createAsyncThunk('party/deletePieza', async (id) => {
  const piezaRef = doc(db, 'piezas', id);
  await deleteDoc(piezaRef);
  return id;
});

// Estado inicial
const initialState = {
  items: [],  // Ahora vacío, ya que se obtendrán de Firestore
  search: '',
  foundPiezas: [],
  loading: false,
  error: null
};

const partySlice = createSlice({
  name: 'party',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setFoundPiezas: (state, action) => {
      state.foundPiezas = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Manejar fetchPiezas
    builder.addCase(fetchPiezas.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPiezas.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchPiezas.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Manejar addPieza
    builder.addCase(addPieza.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });

    // Manejar updatePieza
    builder.addCase(updatePieza.fulfilled, (state, action) => {
      const index = state.items.findIndex(pieza => pieza.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    });

    // Manejar deletePieza
    builder.addCase(deletePieza.fulfilled, (state, action) => {
      state.items = state.items.filter(pieza => pieza.id !== action.payload);
    });
  }
});

// Acciones
export const { setSearch, setFoundPiezas } = partySlice.actions;

// Selectores
export const selectAllPiezas = (state) => state.party.items;
export const selectPiezaById = (state, piezaId) => state.party.items.find(pieza => pieza.id === piezaId);
export const selectSearch = (state) => state.party.search;
export const selectFoundPiezas = (state) => state.party.foundPiezas;

export default partySlice.reducer;
