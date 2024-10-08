import React, { useState, useEffect, useRef } from "react";
import "./CSS/LoginSignup.css";
import { useSelector, useDispatch } from "react-redux";
import { addParty } from "../ReduxToolkit/partySlice";
import { useNavigate } from "react-router-dom";
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useLoadScript, Autocomplete } from "@react-google-maps/api"; // Importar Autocomplete y useLoadScript

const AgregarFiesta = () => {
  const dispatch = useDispatch();
  const allParties = useSelector((state) => state.party.items);
  const navigate = useNavigate();

  const [registro, setRegistro] = useState({
    name: "",
    images: [],
    price: "",
    category: "recintos",
    ubicacion: "",
    stock: 1,
    descripcion: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);

  // Ref para almacenar la referencia del Autocomplete
  const autocompleteRef = useRef(null);

  // useLoadScript para cargar la biblioteca de Google Maps
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyATBiLTxjMFxOAVYgVGaWMHvsC2MtQ093A", // Reemplazar con tu clave
    libraries: ["places"],
  });

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
        newImages.push(file);
        setRegistro((prev) => ({ ...prev, images: [...prev.images, file] }));
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
          newImages.push(file);
          setRegistro((prev) => ({ ...prev, images: [...prev.images, file] }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleContinuarClick = async () => {
    const { name, descripcion, price, stock, images, ubicacion } = registro;
    if (!name || !descripcion || !price || !stock || images.length === 0) {
      setErrorMessage("Por favor, completá los campos obligatorios.");
      return;
    }
    if (price <= 0 || stock <= 0) {
      setErrorMessage("Por favor, revisa los datos ingresados.");
      return;
    }

    const imageUrls = [];
    try {
      for (const file of images) {
        const storageRef = ref(storage, `fiestas/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }
    } catch (error) {
      console.error("Error al subir las imágenes:", error);
      setErrorMessage("Error al subir las imágenes. Intenta nuevamente.");
      return;
    }

    const nuevoId = allParties.length > 0 ? allParties[allParties.length - 1].id + 1 : 1;

    const partyData = {
      id: nuevoId,
      name,
      ubicacion,
      stock,
      price,
      images: imageUrls,
      image: imageUrls[0],
      descripcion: registro.descripcion,
      category: registro.category,
    };

    try {
      const partyRef = doc(db, "fiestas", nuevoId.toString());
      await setDoc(partyRef, partyData);
    } catch (error) {
      console.error("Error al guardar la fiesta en Firestore:", error);
      setErrorMessage("Error al guardar la fiesta. Intenta nuevamente.");
      return;
    }

    dispatch(addParty(partyData));
    navigate(`/partys/${nuevoId}`);
    setErrorMessage("");
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      setRegistro((prev) => ({
        ...prev,
        ubicacion: place.formatted_address || place.name || "",
      }));
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loadError) return <div>Error al cargar Google Maps</div>;
  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <div className="loginsignup" onPaste={handlePaste}>
      <div className="loginsignup-container">
        <h1>Agregar Publicación del artículo</h1>
        <div className="loginsignup-fields">
          <input
            type="text"
            name="name"
            onChange={onChangeValues}
            placeholder="Título de la Publicación (*)"
            value={registro.name}
          />
          <input
            type="text"
            name="descripcion"
            onChange={onChangeValues}
            placeholder="Nombre de la pieza (*)"
            value={registro.descripcion}
          />
          <input
            type="text"
            name="stock"
            min="1"
            onChange={onChangeValues}
            placeholder="Stock disponible (*)"
            value={registro.stock}
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: "1.5rem", marginRight: "10px" }}>$</span>
            <input
              type="number"
              name="price"
              min="1"
              onChange={onChangeValues}
              placeholder="Precio del artículo (*)"
              value={registro.price}
            />
          </div>

          {/* Campo de entrada con Autocomplete para la ubicación */}
          <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)} onPlaceChanged={handlePlaceChanged}>
            <input
              type="text"
              name="ubicacion"
              onChange={onChangeValues}
              placeholder="Dirección del Lugar"
              value={registro.ubicacion}
              className="location-input"
            />
          </Autocomplete>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
            id="file-upload"
            multiple
          />
          <label htmlFor="file-upload" style={{ cursor: "pointer", border: "1px solid #ccc", padding: "10px", display: "inline-block", backgroundColor: "#f0f0f0" }}>
            Cargar Imágenes del Evento
          </label>
          
          {imagePreviews.length > 0 && (
            <div style={{ marginTop: "10px" }}>
              <h4>Previsualización de las Imágenes:</h4>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {imagePreviews.map((image, index) => (
                  <img key={index} src={image} alt={`Imagen de la ficha ${index + 1}`} style={{ maxWidth: "100px", height: "auto", marginRight: "10px", marginBottom: "10px" }} />
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
        <button onClick={handleContinuarClick}>Agregar artículo</button>
      </div>
    </div>
  );
};

export default AgregarFiesta;
