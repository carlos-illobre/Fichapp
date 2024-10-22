import React, { useState } from "react";
import "./CSS/LoginSignup.css";
import { useNavigate } from "react-router-dom";
import { storage, db } from "../firebase"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

const Registro3D = () => {
  const navigate = useNavigate();
  
  const [registro, setRegistro] = useState({
    ubicacion: "",
    cbu: "",
    impresora: null,
    filamentoPrecio: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0); // Para el progreso de carga

  const onChangeValues = (event) => {
    const { name, value } = event.target;
    setRegistro({ ...registro, [name]: value });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setRegistro((prev) => ({ ...prev, impresora: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinuarClick = async () => {
    const { ubicacion, cbu, filamentoPrecio, impresora } = registro;
    if (!ubicacion || !cbu || !filamentoPrecio || !impresora) {
      setErrorMessage("Por favor, completá todos los campos.");
      return;
    }

    let impresoraUrl = "";
    try {
      const storageRef = ref(storage, `impresoras/${impresora.name}`);
      const uploadTask = uploadBytes(storageRef, impresora);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress); // Actualiza el progreso
        },
        (error) => {
          console.error("Error al subir la foto de la impresora:", error);
          setErrorMessage("Error al subir la foto. Intenta nuevamente.");
        },
        async () => {
          impresoraUrl = await getDownloadURL(uploadTask.snapshot.ref);
          
          const registroData = { 
            ubicacion, 
            cbu, 
            filamentoPrecio, 
            impresoraUrl, 
          };

          const registroRef = doc(db, "registro3d", cbu); 
          await setDoc(registroRef, registroData);
          navigate("/gracias");
        }
      );
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      setErrorMessage("Error al guardar los datos. Intenta nuevamente.");
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>Registro para Servicio de Impresión 3D</h1>
        <p>Al llenar este formulario vas a ser ingresado al listado de quienes ofrecen servicios de impresión 3D como alternativa para el cliente cuando no encuentre la ficha que busca. Por tu suscripción a esta lista se te estará cobrando X monto.</p>
        
        <div className="loginsignup-fields">
          <div className="form-group">
            <label htmlFor="ubicacion">Ubicación (donde trabajás) *</label>
            <input
              type="text"
              name="ubicacion"
              onChange={onChangeValues}
              placeholder="Ej: Calle Falsa 123"
              value={registro.ubicacion}
              className={!registro.ubicacion ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cbu">CBU *</label>
            <input
              type="text"
              name="cbu"
              onChange={onChangeValues}
              placeholder="Ej: 000-0000-00000000"
              value={registro.cbu}
              className={!registro.cbu ? 'error' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="impresora">Cargar Foto de la Impresora 3D *</label>
            <div className="file-drop-zone">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="file-upload"
                hidden
              />
              <label htmlFor="file-upload" className="drop-label">
                Arrastrá y soltá la imagen aquí o hacé <span className="hyperlink">clic aqui</span> para seleccionar una foto.
              </label>
            </div>

            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Foto de la impresora" />
              </div>
            )}

            {uploadProgress > 0 && (
              <div className="progress-bar">
                <div style={{ width: `${uploadProgress}%` }} className="progress" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="filamentoPrecio">Precio por cantidad de filamento usado *</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ fontSize: "1.5rem", marginRight: "10px" }}>$</span>
              <input
                type="number"
                name="filamentoPrecio"
                min="1"
                onChange={onChangeValues}
                placeholder="Ej: 500"
                value={registro.filamentoPrecio}
                className={!registro.filamentoPrecio ? 'error' : ''}
              />
            </div>
          </div>
        </div>
        
        {errorMessage && (
          <p className="error-message" style={{ color: "red" }}>
            {errorMessage}
          </p>
        )}

        <button className="btn-primary" onClick={handleContinuarClick}>
          Registrarse
        </button>
      </div>
    </div>
  );
};

export default Registro3D;
