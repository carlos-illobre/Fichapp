import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom"; // Cambia useHistory por useNavigate
import { updatePieza, selectAllPiezas } from "../ReduxToolkit/partySlice";
import "./CSS/Partys.css";

const PartysEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Cambia useHistory por useNavigate
  const allParties = useSelector(selectAllPiezas);
  const { partyId } = useParams();
  const party = allParties.find((e) => e.id === Number(partyId));
  const [cambioMessage, setCambioMessage] = useState("");


  const [formData, setFormData] = useState({
    juego: "",
    nombre: "",
    stock: "",
    price: "",
    barrio: ""
  });

  useEffect(() => {
    if (party) {
      setFormData({
        juego: party.juego,
        nombre: party.nombre,
        stock: party.stock,
        price: party.price,
        barrio: party.barrio
      });
    }
  }, [party]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    dispatch(updatePieza({ id: Number(partyId), ...formData }));
  //console.log("Se intentó actualizar:", { id: partyId, ...formData }); // partyId debería ser un string aquí
    setCambioMessage("Se han guardado exitosamente los cambios.");
    //navigate(`/partys/${partyId}`); Se rompe
  };

  if (!party) {
    return <div>Loading...</div>;
  }

  return (
    <div className="general-page">
      <div className="product-page-container">
        <div className="product-details-container">
          <h1 className="product-title">Editar {party.juego}</h1>
          
          <label>
            Juego:
            <input
              type="text"
              name="juego"
              value={formData.juego}
              onChange={handleChange}
            />
          </label>
          
          <label>
            Nombre:
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </label>
          
          <label>
            Stock:
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
            />
          </label>
          
          <label>
            Precio:
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </label>
          
          <label>
            Ubicación:
            <input
              type="text"
              name="barrio"
              value={formData.barrio}
              onChange={handleChange}
            />
          </label>

          <button onClick={handleUpdate}>Guardar Cambios</button>
          {cambioMessage && (
          <p className="cambio-message" style={{ color: "green" }}>
            {cambioMessage}
          </p>
        )}
        </div>
      </div>
    </div>
  );
};

export default PartysEdit;
