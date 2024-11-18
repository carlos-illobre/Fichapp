import React, { useState, useEffect, useRef } from "react";
import "./CSS/LoginSignup.css";
import { useSelector, useDispatch } from "react-redux";
import { addPieza, addPiezaEmpresa } from "../ReduxToolkit/partySlice";
import { useNavigate } from "react-router-dom";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { getAuth } from "firebase/auth";
const AgregarJuegoEmpresa = () => {
  const dispatch = useDispatch();
  const allParties = useSelector((state) => state.party.items);
  const navigate = useNavigate();
  const userName = useSelector((state) => state.user);

  const [registro, setRegistro] = useState({
    juego: "",
    images: [],
    price: "",
    ubicacion: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [randomNumber, setRandomNumber] = useState(generateRandomNumber());

  // Ref para almacenar la referencia del Autocomplete
  const autocompleteRef = useRef(null);

  // useLoadScript para cargar la biblioteca de Google Maps
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyATBiLTxjMFxOAVYgVGaWMHvsC2MtQ093A",
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
    const { juego, price, images, ubicacion } = registro;
    if (!juego) {
      setErrorMessage("Por favor, completá el campo 'Juego'.");
      return;
    }

    if (!price) {
      setErrorMessage("Por favor, completá el campo 'Precio'.");
      return;
    }
    // if (!stock) {
    //   setErrorMessage("Por favor, completá el campo 'Stock'.");
    //   return;
    // }
    if (images.length === 0) {
      setErrorMessage("Por favor, agregá al menos una imagen.");
      return;
    }
    if (price <= 0) {
      setErrorMessage("Por favor, revisa los datos ingresados.");
      return;
    }

    const imageUrls = [];
    try {
      for (const file of images) {
        const storageRef = ref(storage, `fiestas/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef); // Obtener la URL de descarga
        imageUrls.push(url); // Guardar la URL
      }
    } catch (error) {
      console.error("Error al subir las imágenes:", error);
      setErrorMessage("Error al subir las imágenes. Intenta nuevamente.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    const email = user.email;
    const name = userName.name;

    const partyData = {
      juego,
      barrio: ubicacion,
      price,
      image: imageUrls[0],
      email,
      nombre: name,
      id: generateRandomNumber(),
    };

    // const pieza = await addDoc(collection(db, "pubEmpresas"), partyData);
    dispatch(addPiezaEmpresa(partyData));
    navigate(`/PiezasEmpresa`);
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

  function generateRandomNumber() {
    return Math.floor(100 + Math.random() * 900); // Genera un número entre 100 y 999
  }

  if (loadError) return <div>Error al cargar Google Maps</div>;
  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <div className="loginsignup" onPaste={handlePaste}>
      <div className="loginsignup-container">
        <h1>Publicar Juego</h1>
        <div className="loginsignup-fields">
          <input
            type="text"
            name="juego"
            onChange={onChangeValues}
            placeholder="Nombre del Juego (*)"
            value={registro.juego}
          />

          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: "1.5rem", marginRight: "10px" }}>$</span>
            <input
              type="number"
              name="price"
              min="1"
              onChange={onChangeValues}
              placeholder="Precio de la pieza generica (*)"
              value={registro.price}
            />
          </div>

          <Autocomplete
            onLoad={(ref) => (autocompleteRef.current = ref)}
            onPlaceChanged={handlePlaceChanged}
            options={{
              // types: ["sublocality"], // Limita los resultados a sublocalidades (barrios)
              componentRestrictions: { country: "AR" }, // Restringe a Argentina (código ISO de Argentina)
            }}
          >
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

          <label
            htmlFor="file-upload"
            style={{
              cursor: "pointer",
              border: "1px solid #ccc",
              padding: "10px",
              display: "inline-block",
              backgroundColor: "#f0f0f0",
            }}
          >
            Cargar Imágenes de la pieza
          </label>

          {imagePreviews.length > 0 && (
            <div style={{ marginTop: "10px" }}>
              <h4>Previsualización de las Imágenes:</h4>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {imagePreviews.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Imagen de la pieza ${index + 1}`}
                    style={{
                      maxWidth: "100px",
                      height: "auto",
                      marginRight: "10px",
                      marginBottom: "10px",
                    }}
                  />
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
        <button onClick={handleContinuarClick}>Publicar Juego</button>
      </div>
    </div>
  );
};

export default AgregarJuegoEmpresa;
