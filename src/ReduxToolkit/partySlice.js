import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase';  // Importa la instancia de Firestore
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';

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

export const descountStockParty = createAsyncThunk('party/descountStockParty', async ({ id, quantity }) => {
  const partyRef = doc(db, "piezas", id);
  const docSnap = await getDoc(partyRef);  // Cambiamos a getDoc para obtener un único documento
  const currentParty = docSnap.data();
  const newStock = currentParty.stock - quantity;

  if (newStock < 0) {
    throw new Error('El stock no puede ser negativo');
  }

  await updateDoc(partyRef, { stock: newStock });
  return { id, newStock };
});



// Estado inicial
const initialState = {
  items: [],  // Ahora vacío, ya que se obtendrán de Firestore
  search: '',
  isSearching: false, // variable agregada para saber si se disparo una busquda
  foundPiezas: [],
  foundPiezasEmpresa: [],
  foundPiezasImpresora: [],
  loading: false,
  error: null
};

const partySlice = createSlice({
  name: 'party',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
      state.isSearching = action.payload !== ''
    },
    setFoundPiezas: (state, action) => {  // Nueva acción para almacenar las piezas encontradas
      state.foundPiezas = action.payload;
      state.isSearching = action.payload !== ''

    },
    setFoundPiezasEmpresa: (state, action) => {  // Nueva acción para almacenar las piezas encontradas
      state.foundPiezasEmpresa = action.payload;
    },
    setFoundPiezasImpresora: (state, action) => {  // Nueva acción para almacenar las piezas encontradas
      state.foundPiezasImpresora = action.payload;
    },
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

    builder.addCase(descountStockParty.fulfilled, (state, action) => {
      const party = state.items.find(party => party.id === action.payload.id);
      if (party) {
        party.stock = action.payload.newStock;
      }
    });
  }
});
// Acciones
export const { setParties, addParty, updateParty, deleteParty, setSearch, setFoundPiezas, setFoundPiezasEmpresa, setFoundPiezasImpresora } = partySlice.actions;

// Selectores
export const selectAllPiezas = (state) => state.party.items;
export const selectPiezaById = (state, piezaId) => state.party.items.find(pieza => pieza.id === piezaId);
export const selectSearch = (state) => state.party.search;
export const selectFoundPiezas = (state) => state.party.foundPiezas;
export const selectFoundPiezasEmpresa = (state) => state.party.foundPiezasEmpresa;
export const selectFoundPiezasImpresora = (state) => state.party.foundPiezasImpresora;
export const selectIsSearching = (state) => state.party.isSearching;

export default partySlice.reducer;
