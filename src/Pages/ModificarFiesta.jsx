import React, { useState, useEffect } from "react";
import "./CSS/LoginSignup.css";
import {useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateParty } from "../ReduxToolkit/partySlice";

const ModificarFiesta = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [party, setParty] = useState(location.state?.party || {});
  const [errorMessage, setErrorMessage] = useState("");
  
  useEffect(() => {
    if (location.state?.party) {
      setParty(location.state.party);
    } else {
      navigate("/");
    }
  }, [location.state, navigate]);

  const onChangeValues = ({ target }) => {
    setParty({ ...party, [target.name]: target.value });
  };

  const handleModificarClick = () => {
    const { name, fecha, hora, lugar, new_price, stock, image } = party;
    if (!name || !fecha || !hora || !lugar || !new_price || !stock || !image) {
      setErrorMessage("Por favor, completá los campos obligatorios.");
      return;
    }
    if (new_price <= 0 || stock <= 0) {
      setErrorMessage("Por favor, revisa los datos ingresados.");
      return;
    }
    dispatch(updateParty(party));
    navigate("/");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>Modificar Fiesta</h1>
        <div className="loginsignup-fields">
          <input
            type="text"
            name="name"
            onChange={onChangeValues}
            placeholder="Título del Evento (*)"
            value={party.name || ""}
          />
          <input
            type="date"
            name="fecha"
            onChange={onChangeValues}
            placeholder="Fecha del Evento (DD/MM/AA) (*)"
            value={party.fecha || ""}
          />
          <input
            type="text"
            name="hora"
            onChange={onChangeValues}
            placeholder="Hora del Evento (HH:MM) (*)"
            value={party.hora || ""}
          />
          <input
            type="text"
            name="lugar"
            onChange={onChangeValues}
            placeholder="Nombre del Lugar del Evento (*)"
            value={party.lugar || ""}
          />
          <input
            type="text"
            name="ubicacion"
            onChange={onChangeValues}
            placeholder="Dirección del Lugar"
            value={party.ubicacion || ""}
          />
          <input
            type="number"
            name="stock"
            min="1"
            onChange={onChangeValues}
            placeholder="Cantidad de Entradas del Evento (*)"
            value={party.stock || ""}
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: "1.5rem", marginRight: "10px" }}>$</span>
            <input
              type="number"
              name="new_price"
              min="1"
              onChange={onChangeValues}
              placeholder="Precio de la Entrada del Evento (*)"
              value={party.new_price || ""}
            />
          </div>
          <input
            type="text"
            name="image"
            onChange={onChangeValues}
            placeholder="URL de la Imagen del Evento (*)"
            value={party.image || ""}
          />
        </div>
        {errorMessage && (
          <p className="error-message" style={{ color: "red" }}>
            {errorMessage}
          </p>
        )}
        <button onClick={handleModificarClick}>Modificar Fiesta</button>
      </div>
    </div>
  );
};

export default ModificarFiesta;
