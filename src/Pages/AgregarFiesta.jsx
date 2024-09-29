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
    images: [], // Cambiado a un arreglo para almacenar múltiples imágenes
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
  const [imagePreviews, setImagePreviews] = useState([]); // Arreglo para las previsualizaciones

  const onChangeValues = (event) => {
    const { name, value } = event.target;
    setRegistro({ ...registro, [name]: value });
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = [];
    const newPreviews = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        setImagePreviews((prev) => [...prev, reader.result]);
        newImages.push(reader.result); // Agregar la imagen cargada
        setRegistro((prev) => ({ ...prev, images: [...prev.images, reader.result] })); // Actualizar el estado
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    const newImages = [];
    const newPreviews = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === "file") {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result);
          setImagePreviews((prev) => [...prev, reader.result]);
          newImages.push(reader.result); // Agregar la imagen pegada
          setRegistro((prev) => ({ ...prev, images: [...prev.images, reader.result] })); // Actualizar el estado
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleContinuarClick = () => {
    const { name, fecha, hora, lugar, new_price, stock, images } = registro;
    if (!name || !fecha || !hora || !lugar || !new_price || !stock || images.length === 0) {
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
    <div className="loginsignup" onPaste={handlePaste}>
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

          {/* Campo de archivo oculto para cargar imágenes */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }} // Ocultar el campo de archivo
            id="file-upload" // ID para referenciar
            multiple // Permitir selección de múltiples archivos
          />
          
          {/* Botón personalizado para cargar imagen */}
          <label htmlFor="file-upload" style={{ cursor: "pointer", border: "1px solid #ccc", padding: "10px", display: "inline-block", backgroundColor: "#f0f0f0" }}>
            Cargar Imágenes del Evento
          </label>
          
          {/* Previsualización de las imágenes */}
          {imagePreviews.length > 0 && (
            <div style={{ marginTop: "10px" }}>
              <h4>Previsualización de las Imágenes:</h4>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {imagePreviews.map((image, index) => (
                  <img key={index} src={image} alt={`Imagen del Evento ${index + 1}`} style={{ maxWidth: "100px", height: "auto", marginRight: "10px", marginBottom: "10px" }} />
                ))}
              </div>
            </div>
          )}
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
