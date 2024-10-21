import { createSlice } from '@reduxjs/toolkit';
import all_parties from '../Components/Assets/all_parties';

const initialState = {
  items: all_parties, 
  search: '',
  foundPiezas: [],
  foundPiezasEmpresa: [],
  foundPiezasImpresora: [],
};

const partySlice = createSlice({
  name: 'party',
  initialState,
  reducers: {
    setParties: (state, action) => {
      state.items = action.payload;
    },
    addParty: (state, action) => {
      state.items.push(action.payload);
    },
    updateParty: (state, action) => {
      const index = state.items.findIndex(party => party.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteParty: (state, action) => {
      state.items = state.items.filter(party => party.id !== action.payload);
    },
    descountStockParty: (state, action) => {
      const { id, quantity } = action.payload;
      const party = state.items.find(party => party.id === id);
      if (party) {
        party.stock -= quantity;
      }
    },
    setSearch: (state, action) => {
        state.search = action.payload;
      },
    setFoundPiezas: (state, action) => {  // Nueva acción para almacenar las piezas encontradas
      state.foundPiezas = action.payload;
    },
    setFoundPiezasEmpresa: (state, action) => {  // Nueva acción para almacenar las piezas encontradas
      state.foundPiezasEmpresa = action.payload;
    },
    setFoundPiezasImpresora: (state, action) => {  // Nueva acción para almacenar las piezas encontradas
      state.foundPiezasImpresora = action.payload;
    },
  },
});

export const { setParties, addParty, updateParty, deleteParty, descountStockParty, setSearch, setFoundPiezas, setFoundPiezasEmpresa, setFoundPiezasImpresora } = partySlice.actions;


// Selectores
export const selectAllParties = state => state.party.items;
export const selectPartyById = (state, partyId) => state.party.items.find(party => party.id === partyId);
export const selectSearch = state => state.party.search;
export const selectFoundPiezas = (state) => state.party.foundPiezas;
export const selectFoundPiezasEmpresa = (state) => state.party.foundPiezasEmpresa;
export const selectFoundPiezasImpresora = (state) => state.party.foundPiezasImpresora;

export default partySlice.reducer;
