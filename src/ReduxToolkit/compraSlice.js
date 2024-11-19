import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../firebase"; // Importa la instancia de Firestore
import { collection, addDoc } from "firebase/firestore";
import emailjs from "emailjs-com";

const sendEmailComprador = async (templateParams) => {
  try {
    const result = await emailjs.send(
      "service_q3xt5r8", // Reemplaza con tu Service ID
      "template_k1gwgf3", // Reemplaza con tu Template ID
      templateParams, // Parámetros dinámicos
      "FrWU1KMdo5af0RSgr" // Reemplaza con tu Public Key
    );
    console.log("Correo comprador enviado:", result.text);
  } catch (error) {
    console.error("Error al enviar el correo comprador:", error);
  }
};

const sendEmailVendedor = async (templateParams) => {
  try {
    const result = await emailjs.send(
      "service_q3xt5r8", //Service ID
      "template_oz21rc9", //  Template ID
      templateParams, // Parámetros dinámicos
      "FrWU1KMdo5af0RSgr" //  Public Key
    );
    console.log("Correo vendedor enviado :", result.text);
  } catch (error) {
    console.error("Error al enviar el correo vendedor:", error);
  }
};

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

      const emailParams = {
        to_name: nameComprador,
        to_email: emailComprador,
        tipo_compra: "por carrito",
        message: `Gracias por su compra. El total es $${totalAmount}. Aquí está el detalle de su compra:\n\n${items
          .map((item) => {
            const juego = item.juego || "Juego desconocido"; // Valor por defecto si juego es null
            const nombre = item.nombre || "Producto desconocido"; // Manejo de nombre vacío
            const cantidad = item.cantidad || 0;
            const precio = item.precio || 0;
            const subtotal = cantidad * precio;

            return `Del juego ${juego} - ${nombre}: ${cantidad} x $${precio} (Subtotal: $${subtotal})`;
          })
          .join("\n")}\n\n¡Gracias por confiar en nosotros!`,
      };

      // Llama a la función de envío de correo
      sendEmailComprador(emailParams);

      const discount = 0.1; // El 10% en formato decimal
      const totalAfterDiscount = totalAmount - totalAmount * discount;
      const emailParamsVendedor = {
        to_email: items[0].owner,
        tipo_venta: "por carrito",
        message: `El total de tu venta es de $${totalAfterDiscount}. Una vez hecha la entrega del producto se te va a estar acreditando el pago en tu cuenta
        Aquí está el detalle de su venta:\n\n${items
          .map((item) => {
            const juego = item.juego || "Juego desconocido"; // Valor por defecto si juego es null
            const nombre = item.nombre || "Producto desconocido"; // Manejo de nombre vacío
            const cantidad = item.cantidad || 0;
            const precio = item.precio || 0;
            const subtotal = cantidad * precio;

            return `Del juego ${juego} - ${nombre}: ${cantidad} x $${precio} (Subtotal: $${subtotal})`;
          })
          .join("\n")}\n\n¡Gracias por confiar en nosotros!`,
      };

      // Llama a la función de envío de correo
      sendEmailVendedor(emailParamsVendedor);

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
      const nuevaCompra = {
        totalAmount,
        promoCodeApplied,
        emailComprador,
        nameComprador,
        owner,
        items: items.map((item) => ({
          telefono: item.telefono,
          direccion: item.direccion,
          descripcion: item.descripcion,
          observaciones: item.observaciones,
          archivo: item.archivo ? item.archivo.name : null,
        })),
        createdAt: new Date().toISOString(),
        tipoCompra: "3D",
      };
      const emailParams = {
        to_name: nameComprador,
        to_email: emailComprador,
        tipo_compra: "servicio 3D",
        message: `Gracias por su compra. El total es $${totalAmount}. Aquí está el detalle de su compra:\n\n${items
          .map((item) => {
            const descripcion = item.descripcion;
            const observaciones = item.observaciones;

            return `su pedido de impresion 3D fue ${descripcion} con observaciones ${observaciones}`;
          })
          .join("\n")}\n\n¡Gracias por confiar en nosotros!`,
      };

      // Llama a la función de envío de correo
      sendEmailComprador(emailParams);

      const discount = 0.15; // El 15% en formato decimal
      const totalAfterDiscount = totalAmount - totalAmount * discount;
      const emailParamsVendedor = {
        to_email: owner,
        tipo_venta: "por servicio impresión 3D",
        message: `El total de tu venta es de $${totalAfterDiscount}. Una vez hecha la entrega del producto se te va a estar acreditando el pago en tu cuenta
        Aquí está el detalle de su venta:\n\n${items
          .map((item) => {
            const descripcion = item.descripcion || "Descripción no disponible";
            const observaciones = item.observaciones || "No hay observaciones.";
            const archivoUrl = item.archivo;

            return `El pediddo es con esta descripcion: ${descripcion} y el cliente hizo estas observaciones ${observaciones}
            y la imagen del producto que se mando es la siguiente ${archivoUrl}`;
          })
          .join("\n")}\n\n¡Gracias por confiar en nosotros!`,
      };

      // Llama a la función de envío de correo
      sendEmailVendedor(emailParamsVendedor);

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

      const emailParams = {
        to_name: nameComprador,
        to_email: emailComprador,
        tipo_compra: "pedido a Empresa",
        message: `Gracias por su compra. El total es $${totalAmount}. Aquí está el detalle de su compra:\n\n${items
          .map((item) => {
            const descripcion = item.descripcion;
            const observaciones = item.observaciones;

            return `su pedido de ficha fue sobre el juego ${juego} con descripcion de la ficha 
            ${descripcion} con observaciones ${observaciones}`;
          })
          .join("\n")}\n\n¡Gracias por confiar en nosotros!`,
      };

      // Llama a la función de envío de correo
      sendEmailComprador(emailParams);

      const discount = 0.15; // El 15% en formato decimal
      const totalAfterDiscount = totalAmount - totalAmount * discount;
      const emailParamsVendedor = {
        to_email: owner,
        tipo_venta: "por publicación de empresa",
        message: `El total de tu venta es de $${totalAfterDiscount}. Una vez hecha la entrega del producto se te va a estar acreditando el pago en tu cuenta
        Aquí está el detalle de su venta:\n\n${items
          .map((item) => {
            const descripcion = item.descripcion || "Descripción no disponible";
            const observaciones = item.observaciones || "No hay observaciones.";
            const archivoUrl = item.archivo;

            return `El pedido es sobre el juego ${juego}. 
            El pediddo es con esta descripcion: ${descripcion} y el cliente hizo estas observaciones ${observaciones}
            y la imagen del producto que se mando es la siguiente ${archivoUrl}`;
          })
          .join("\n")}\n\n¡Gracias por confiar en nosotros!`,
      };

      // Llama a la función de envío de correo
      sendEmailVendedor(emailParamsVendedor);

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
      .addCase(compraCarrito.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        console.log("Items recibidos:", action.payload.items);
        console.log("Items recibidos:", action.payload.items.juego);
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
