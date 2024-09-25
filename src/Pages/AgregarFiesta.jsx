import React, { useState, useEffect } from "react";
import "./CSS/LoginSignup.css";
import { useSelector, useDispatch } from "react-redux";
import { addParty } from "../ReduxToolkit/partySlice";
import { useNavigate } from "react-router-dom";

const AgregarFiesta = () => {
  const dispatch = useDispatch();
  const allParties = useSelector((state) => state.party.items);
  const navigate = useNavigate();
  
  const [registro, setRegistro] = useState({
    name: "",
    image: "",
    new_price: "",
    old_price: 0,
    category: "recintos",
    fecha: "",
    hora: "",
    lugar: "",
    ubicacion: "",
    stock: 1,
    descripcion: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const onChangeValues = (event) => {
    const { name, value } = event.target;
    setRegistro({ ...registro, [name]: value });
  };

  const handleContinuarClick = () => {
    const { name, fecha, hora, lugar, new_price, stock, image } = registro;
    if (!name || !fecha || !hora || !lugar || !new_price || !stock || !image) {
      setErrorMessage("Por favor, completá los campos obligatorios.");
      return;
    }
    if (new_price <= 0 || stock <= 0) {
      setErrorMessage("Por favor, revisa los datos ingresados.");
      return;
    }
    
    const nuevoId = allParties.length > 0 ? allParties[allParties.length - 1].id + 1 : 1;
    const party = { id: nuevoId, ...registro };

    dispatch(addParty(party));
    navigate(`/partys/${nuevoId}`);
    setErrorMessage("");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>Agregar Fiesta</h1>
        <div className="loginsignup-fields">
          <input
            type="text"
            name="name"
            onChange={onChangeValues}
            placeholder="Título del Evento (*)"
            value={registro.name}
          />
          <input
            type="date"
            name="fecha"
            onChange={onChangeValues}
            placeholder="Fecha del Evento (DD/MM/AA) (*)"
            value={registro.fecha}
          />
          <input
            type="text"
            name="hora"
            onChange={onChangeValues}
            placeholder="Hora del Evento (HH:MM) (*)"
            value={registro.hora}
          />
          <input
            type="text"
            name="lugar"
            onChange={onChangeValues}
            placeholder="Nombre del Lugar del Evento (*)"
            value={registro.lugar}
          />
          <input
            type="text"
            name="ubicacion"
            onChange={onChangeValues}
            placeholder="Dirección del Lugar"
            value={registro.ubicacion}
          />
          <input
            type="number"
            name="stock"
            min="1"
            onChange={onChangeValues}
            placeholder="Cantidad de Entradas del Evento (*)"
            value={registro.stock}
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: "1.5rem", marginRight: "10px" }}>$</span>
            <input
              type="number"
              name="new_price"
              min="1"
              onChange={onChangeValues}
              placeholder="Precio de la Entrada del Evento (*)"
              value={registro.new_price}
            />
          </div>

          <input
            type="text"
            name="image"
            onChange={onChangeValues}
            placeholder="URL de la Imagen del Evento (*)"
            value={registro.image}
          />
        </div>
        {errorMessage && (
          <p className="error-message" style={{ color: "red" }}>
            {errorMessage}
          </p>
        )}
        <button onClick={handleContinuarClick}>Agregar Fiesta</button>
      </div>
    </div>
  );
};

export default AgregarFiesta;
