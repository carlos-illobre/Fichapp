import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../firebase"; // Importa la instancia de Firestore
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
  where,
  query,
  setDoc,
  get,
} from "firebase/firestore";

// Acción asíncrona para agregar la compra a la colección "compras"
export const compraCarrito = createAsyncThunk(
  "compra/compraCarrito",
  async (
    { totalAmount, promoCodeApplied, emailComprador, nameComprador, items },
    thunkAPI
  ) => {
    try {
      // Crear el objeto de la compra
      const nuevaCompra = {
        totalAmount,
        promoCodeApplied,
        emailComprador,
        nameComprador,
        items: items.map((item) => ({
          juego: item.juego || null,
          nombre: item.nombre || null,
          cantidad: item.cantidad || 0,
          precio: item.precio || 0,
          owner: item.owner || null,
        })),
        createdAt: new Date().toISOString(),
        tipoCompra: "carrito",
      };

      // Agregar a Firebase
      const docRef = await addDoc(collection(db, "compras"), nuevaCompra);

      // Retornar el objeto de la compra con su ID
      return { id: docRef.id, ...nuevaCompra };
    } catch (error) {
      console.log("error" + error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const compra3D = createAsyncThunk(
  "compra/compra3D",
  async (
    {
      totalAmount,
      promoCodeApplied,
      emailComprador,
      nameComprador,
      owner,
      items,
    },
    thunkAPI
  ) => {
    try {
      // Crear el objeto de la compra
      const nuevaCompra = {
        totalAmount,
        promoCodeApplied,
        emailComprador,
        nameComprador,
        owner,
        items: items.map((item) => ({
          // nombre: user.name || "",
          // email: user.email || "",
          telefono: item.telefono,
          direccion: item.direccion,
          descripcion: item.descripcion,
          observaciones: item.observaciones,
          archivo: item.archivo ? item.archivo.name : null,
        })),
        createdAt: new Date().toISOString(),
        tipoCompra: "3D",
      };

      // Agregar a Firebase
      const docRef = await addDoc(collection(db, "compras"), nuevaCompra);

      // Retornar el objeto de la compra con su ID
      return { id: docRef.id, ...nuevaCompra };
    } catch (error) {
      console.log("error" + error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const compraEmpresa = createAsyncThunk(
  "compra/compraEmpresa",
  async (
    {
      totalAmount,
      promoCodeApplied,
      emailComprador,
      nameComprador,
      owner,
      juego,
      items,
    },
    thunkAPI
  ) => {
    try {
      const nuevaCompra = {
        totalAmount,
        promoCodeApplied,
        emailComprador,
        nameComprador,
        owner,
        juego,
        items: items.map((item) => ({
          telefono: item.telefono,
          direccion: item.direccion,
          descripcion: item.descripcion,
          observaciones: item.observaciones,
          archivo: item.archivo ? item.archivo.name : null,
        })),
        createdAt: new Date().toISOString(),
        tipoCompra: "Empresa",
      };

      const docRef = await addDoc(collection(db, "compras"), nuevaCompra);

      return { id: docRef.id, ...nuevaCompra };
    } catch (error) {
      console.log("error" + error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const compraSlice = createSlice({
  name: "compra",
  initialState: {
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(compraCarrito.pending, (state) => {
        state.status = "loading";
      })
      .addCase(compraCarrito.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(compraCarrito.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(compra3D.pending, (state) => {
        state.status = "loading";
      })
      .addCase(compra3D.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(compra3D.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(compraEmpresa.pending, (state) => {
        state.status = "loading";
      })
      .addCase(compraEmpresa.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(compraEmpresa.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const selectCompraStatus = (state) => state.compra.status;
export const selectCompraError = (state) => state.compra.error;

export default compraSlice.reducer;
