import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./CSS/SolicitudForm.css";
import axios from "axios";
import { compra3D, compraEmpresa } from "../ReduxToolkit/compraSlice";

const SolicitudForm = ({
  impresoraName,
  is3d,
  mailOwner,
  juego,
  precio,
  onClose,
}) => {
  // Nombre y email del usuario autenticado desde Redux
  const user = useSelector((state) => state.user);
  const [initPoint, setInitPoint] = useState("");
  const dispatch = useDispatch();

  // Inicializamos el formulario con los datos del usuario loggeado
  const [formData, setFormData] = useState({
    nombre: user.name || "", // Nombre del usuario loggeado
    email: user.email || "", // Email del usuario loggeado
    telefono: "",
    direccion: "",
    descripcion: "",
    observaciones: "",
    archivo: null,
  });

  useEffect(() => {
    // Si el nombre o el email del usuario cambia en el estado global, se actualiza el formulario
    setFormData((prevData) => ({
      ...prevData,
      nombre: user.name || "",
      email: user.email || "",
    }));
  }, [user.name, user.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, archivo: e.target.files[0] });
  };

  const handlePayment = async () => {
    try {
      const response = await axios.post(
        "https://api.mercadopago.com/checkout/preferences",
        {
          items: [
            {
              title: "Pago en Marketplace",
              quantity: 1,
              unit_price: parseFloat(precio), // el monto ingresado
            },
          ],
          back_urls: {
            success: `${window.location.origin}/thank-you`,
            failure: `${window.location.origin}/thank-you`, //TODO: SACAR
            pending: `${window.location.origin}/thank-you`, //TODO: SACAR
          },
          auto_return: "approved",
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_MERCADOPAGO_ACCESS_TOKEN}`, // lee el access token de .env
          },
        }
      );
      const { init_point } = response.data;
      setInitPoint(init_point);

      // Redirige al usuario a Mercado Pago
      console.log("init_point", init_point);
      window.location.href = init_point;
    } catch (error) {
      console.error("Error al crear preferencia de pago:", error);
    }
  };
  const handlePurchase3D = () => {
    dispatch(
      compra3D({
        totalAmount: precio,
        promoCodeApplied: false,
        emailComprador: user.email,
        nameComprador: user.name,
        owner: mailOwner,
        items: [formData],
      })
    );
  };
  const handlePurchaseEmpresa = () => {
    dispatch(
      compraEmpresa({
        totalAmount: precio,
        promoCodeApplied: false,
        emailComprador: user.email,
        nameComprador: user.name,
        owner: mailOwner,
        juego: juego,
        items: [formData],
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handlePayment();
    if (is3d) {
      handlePurchase3D();
    } else {
      handlePurchaseEmpresa();
    }
    // alert(`Solicitud enviada para ${impresorName}. ¡Gracias por su compra!`);
    onClose();
  };

  return (
    <div className="solicitud-form">
      <h3>Solicitud de Servicio para {impresoraName}</h3>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Teléfono:</label>
        <input
          type="tel"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          required
        />

        <label>Dirección:</label>
        <input
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          required
        />

        <label>Foto de la pieza:</label>
        <input
          type="file"
          name="archivo"
          onChange={handleFileChange}
          required
        />

        <label>Descripción de la pieza:</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          required
        />

        <label>Observaciones:</label>
        <textarea
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
        />

        <button type="submit" className="submit-button">
          Continuar a Pago
        </button>
        <button type="button" className="cancel-button" onClick={onClose}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default SolicitudForm;
