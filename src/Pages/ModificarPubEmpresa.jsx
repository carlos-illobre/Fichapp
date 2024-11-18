import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updatePiezaEmpresa } from "../ReduxToolkit/partySlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchPiezasEmp } from "../ReduxToolkit/partySlice";

const ModificarPubEmpresa = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pieza } = location.state || {}; // Recibimos los datos de la pieza
  const [registro, setRegistro] = useState({
    juego: pieza?.juego || "",
    image: pieza?.image || "", // Solo una imagen
    price: pieza?.price || "",
    ubicacion: pieza?.barrio || "",
    id: pieza?.id || "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(pieza?.image || "");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (pieza) {
      setRegistro({
        juego: pieza.juego,
        image: pieza.image, // Solo una imagen
        price: pieza.price,
        ubicacion: pieza.barrio,
        id: pieza.id,
      });
    }
  }, [pieza]);

  const onChangeValues = (event) => {
    const { name, value } = event.target;
    setRegistro({ ...registro, [name]: value });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Solo un archivo
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Previsualiza la imagen
        setRegistro((prev) => ({ ...prev, image: file })); // Actualiza el estado con el archivo
      };
      reader.readAsDataURL(file); // Lee la imagen
    }
  };

  const handleContinuarClick = async () => {
    const { juego, price, image, ubicacion } = registro;
    if (!juego || !price || !image) {
      setErrorMessage("Por favor, completa todos los campos.");
      return;
    }

    let imageUrl = imagePreview;
    try {
      if (image && image.name) {
        const storageRef = ref(storage, `fiestas/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef); // Obtener la URL de la imagen subida
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      setErrorMessage("Error al subir la imagen. Intenta nuevamente.");
      return;
    }

    try {
      const piezaUpdate = {
        id: pieza.id,
        juego,
        price,
        barrio: ubicacion,
        image: imageUrl, // Usa solo la primera imagen
      };

      await dispatch(updatePiezaEmpresa(piezaUpdate));
      dispatch(fetchPiezasEmp(user.email));

      navigate(`/user-profile`);
      setErrorMessage("");
    } catch (error) {
      console.error("Error al actualizar la pieza:", error);
      setErrorMessage("Error al actualizar la pieza. Intenta nuevamente.");
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>Modificar Juego</h1>
        <div className="loginsignup-fields">
          <input
            type="text"
            name="juego"
            onChange={onChangeValues}
            placeholder="Nombre del Juego (*)"
            value={registro.juego}
          />
          <input
            type="number"
            name="price"
            min="1"
            onChange={onChangeValues}
            placeholder="Precio de la pieza (*)"
            value={registro.price}
          />
          <input
            type="text"
            name="ubicacion"
            onChange={onChangeValues}
            placeholder="Dirección del Lugar"
            value={registro.ubicacion}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
            id="file-upload"
          />
          <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
            Cargar Imagen de la pieza
          </label>

          {imagePreview && (
            <div style={{ marginTop: "10px" }}>
              <h4>Previsualización de la Imagen:</h4>
              <img
                src={imagePreview}
                alt="Imagen de la pieza"
                style={{
                  maxWidth: "100px",
                  height: "auto",
                  marginRight: "10px",
                  marginBottom: "10px",
                }}
              />
            </div>
          )}
        </div>

        {errorMessage && (
          <p className="error-message" style={{ color: "red" }}>
            {errorMessage}
          </p>
        )}

        <button onClick={handleContinuarClick}>Modificar Juego</button>
      </div>
    </div>
  );
};

export default ModificarPubEmpresa;
