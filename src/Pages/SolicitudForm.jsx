import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux"; 
import "./CSS/SolicitudForm.css";

const SolicitudForm = ({ impresorName, impresorId, onClose }) => {
  // Nombre y email del usuario autenticado desde Redux
  const user = useSelector((state) => state.user);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    //-----------------------------------------------------------------------------------------------------------------------------
    // @CARLOS ACA INTEGRAS MERCADOPAGO Y EL MAIL DE CONFIRMACION------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------
    alert(`Solicitud enviada para ${impresorName}. ¡Gracias por su compra!`);
    onClose();
  };
    //-----------------------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------------------

  return (
    <div className="solicitud-form">
      <h3>Solicitud de Servicio para {impresorName}</h3>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Teléfono:</label>
        <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required />

        <label>Dirección:</label>
        <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} required />

        <label>Foto de la pieza:</label>
        <input type="file" name="archivo" onChange={handleFileChange} required />

        <label>Descripción de la pieza:</label>
        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required />

        <label>Observaciones:</label>
        <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} />

        <button type="submit" className="submit-button">Continuar a Pago</button>
        <button type="button" className="cancel-button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
};

export default SolicitudForm;
