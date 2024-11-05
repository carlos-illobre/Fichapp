import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase';  // Importa la instancia de Firestore
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, getDoc, where, query, setDoc, get} from 'firebase/firestore';


// Thunks asíncronos para interactuar con Firestore

// Obtener todas las piezas desde Firestore
export const fetchPiezas = createAsyncThunk('party/fetchPiezas', async () => {
  const piezasCollection = collection(db, 'piezas');
  const piezasSnapshot = await getDocs(piezasCollection);
  const piezasList = piezasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return piezasList;
});

// Obtener todas las piezas de un usuario desde Firestore
export const fetchPiezasUser = createAsyncThunk('party/fetchPiezas', async (email) => {
  const piezasCollection = collection(db, 'piezas');
  const piezasQuery = query(piezasCollection, where('email', '==', email));
  const piezasSnapshot = await getDocs(piezasQuery);
  const piezasListUser = piezasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return piezasListUser;
});
// Agregar una nueva pieza a Firestore
export const addPieza = createAsyncThunk('party/addPieza', async (newPieza) => {
  const docRef = await addDoc(collection(db, 'piezas'), newPieza);
  return { id: docRef.id, ...newPieza };
});

// Actualizar una pieza existente en Firestore
export const updatePieza = createAsyncThunk('party/updatePieza', async (piezaUpdate) => {
  const piezasCollection =  collection(db, 'piezas');
  //console.log(piezaUpdate);
  const piezaId = Number(piezaUpdate.id);
  //console.log("PiezaID "+piezaId)
  const piezaQuery = query(piezasCollection, where('id', '==', piezaId));
  //console.log('Consulta Firestore:', piezaQuery);
  const querySnapshot = await getDocs(piezaQuery);
  //console.log("Número de documentos encontrados:", querySnapshot.docs.length);
  //const piezaRef =  await query(piezasCollection, where('id', '==', piezaUpdate.id));
  //await setDoc(piezaRef, piezaUpdate, { merge: true });
  if (!querySnapshot.empty) {
    const docRef = doc(db, 'piezas', querySnapshot.docs[0].id); // Obtiene el ID del primer documento que coincide
    await setDoc(docRef, piezaUpdate, { merge: true }); // Actualiza el documento usando merge
    return { id: querySnapshot.docs[0].id, ...piezaUpdate };
  } else {
    throw new Error('No se encontró el documento con el id especificado.');
  }
  });

// Borrar una pieza de Firestore
export const deletePieza = createAsyncThunk('party/deletePieza', async (id) => {
  const piezasCollection =  collection(db, 'piezas');
  const piezaId = Number(id);
  const piezaQuery = query(piezasCollection, where('id', '==', piezaId));
  const querySnapshot = await getDocs(piezaQuery);
  if (!querySnapshot.empty) {
    const docRef = doc(db, 'piezas', querySnapshot.docs[0].id); // Obtiene el ID del primer documento que coincide
    await deleteDoc(docRef)
    return
  } else {
    throw new Error('No se encontró el documento con el id especificado.');
  }
  }
  //const piezaRef = doc(db, 'piezas', id);
  //await deleteDoc(piezaRef);
  //return id;
);

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
  foundPiezasUser: [],
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
    setFoundPiezasUser: (state, action) => {  // Nueva acción para almacenar las piezas del usuario encontradas
      state.foundPiezasUser = action.payload;
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
export const { setParties, addParty, updateParty, deleteParty, setSearch, setFoundPiezas, setFoundPiezasEmpresa, setFoundPiezasImpresora, setFoundPiezasUser } = partySlice.actions;

// Selectores
export const selectAllPiezas = (state) => state.party.items;
export const selectPiezaById = (state, piezaId) => state.party.items.find(pieza => pieza.id === piezaId);
export const selectSearch = (state) => state.party.search;
export const selectFoundPiezas = (state) => state.party.foundPiezas;
export const selectFoundPiezasEmpresa = (state) => state.party.foundPiezasEmpresa;
export const selectFoundPiezasImpresora = (state) => state.party.foundPiezasImpresora;
export const selectFoundPiezasUser = (state) => state.party.foundPiezasUser || [];
export const selectIsSearching = (state) => state.party.isSearching;

export default partySlice.reducer;
