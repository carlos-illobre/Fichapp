import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, onSnapshot, query, addDoc, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Asegúrate de tener configurada la conexión a Firebase correctamente

// Estado inicial
const initialState = {
  items: [], 
  search: '',
  status: 'idle', // Para manejar estados de carga
  error: null,
};

// Thunks asíncronos para obtener los datos de Firebase
export const fetchParties = createAsyncThunk('party/fetchParties', async (_, { dispatch }) => {
  const q = query(collection(db, "piezas"));

  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const partiesArray = [];
      querySnapshot.forEach((doc) => {
        partiesArray.push({ id: doc.id, ...doc.data() });
      });

      // Actualiza el estado de Redux con los datos en tiempo real
      dispatch(updateParties(partiesArray));

      // Resuelve la promesa para que el thunk sea considerado 'cumplido'
      resolve(partiesArray);
    }, (error) => {
      // Si hay un error, rechaza la promesa
      reject(error);
    });

    // Cleanup si se desmonta
    return () => unsubscribe();
  });
});

export const addParty = createAsyncThunk('party/addPartyToFirebase', async (newParty) => {
  const docRef = await addDoc(collection(db, "piezas"), newParty);
  return { id: docRef.id, ...newParty };
});

export const updateParty = createAsyncThunk('party/updatePartyInFirebase', async (updatedParty) => {
  const partyRef = doc(db, "piezas", updatedParty.id);
  await updateDoc(partyRef, updatedParty);
  return updatedParty;
});

export const deleteParty = createAsyncThunk('party/deletePartyFromFirebase', async (partyId) => {
  await deleteDoc(doc(db, "piezas", partyId));
  return partyId;
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

// Slice
const partySlice = createSlice({
  name: 'party',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    updateParties: (state, action) => {
      state.items = action.payload; // Actualizamos los items en tiempo real
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParties.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchParties.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(fetchParties.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addParty.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateParty.fulfilled, (state, action) => {
        const index = state.items.findIndex(party => party.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteParty.fulfilled, (state, action) => {
        state.items = state.items.filter(party => party.id !== action.payload);
      })
      .addCase(descountStockParty.fulfilled, (state, action) => {
        const party = state.items.find(party => party.id === action.payload.id);
        if (party) {
          party.stock = action.payload.newStock;
        }
      });
  },
});

// Acciones
export const { setSearch, updateParties } = partySlice.actions;

// Selectores
export const selectAllParties = state => state.party.items;
export const selectPartyById = (state, partyId) => state.party.items.find(party => party.id === partyId);
export const selectSearch = state => state.party.search;

export default partySlice.reducer;
