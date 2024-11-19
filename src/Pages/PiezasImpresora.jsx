import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useSelector } from "react-redux";
import SolicitudForm from "./SolicitudForm"; // Asegúrate de que la ruta sea correcta
import "./CSS/PiezasImpresora.css";
import { useNavigate, useLocation } from "react-router-dom";

const PiezasImpresora = () => {
  const [impresorasData, setImpresorasData] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState(null); // Estado para la tarjeta seleccionada
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [previousPath, setPreviousPath] = useState(null);

  useEffect(() => {
    const fetchImpresorasData = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("is3DService", "==", true));
        const querySnapshot = await getDocs(q);
        const impresoras = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Excluir al usuario loggeado de los resultados
          if (data.email !== user.email) {
            impresoras.push({
              id: doc.id,
              name: data.name || "Usuario sin nombre",
              location: data.printerData?.location || "Sin ubicación",
              serviceFee: data.printerData?.serviceFee || "Sin tarifa",
              profilePhoto: data.photoUrl || "https://via.placeholder.com/250", // Foto de perfil del usuario
              email: data.email,
            });
          }
        });

        setImpresorasData(
          impresoras.sort((a, b) => a.name.localeCompare(b.name))
        );
      } catch (error) {
        console.error("Error al buscar impresoras en Firebase:", error);
      }
    };

    fetchImpresorasData();
  }, [user.email]);

  const toggleForm = (printerId) => {
    if (user.isLogged) {
      setSelectedPrinter(selectedPrinter === printerId ? null : printerId);
    } else {
      setPreviousPath(window.location.pathname);
      navigate("/loginSignUp");
    }
  };

  return (
    <div className="impresoras-results">
      {impresorasData.map((impresora) => (
        <div key={impresora.id} className="impresora-card">
          <img
            className="impresora-image"
            src={impresora.profilePhoto}
            alt={impresora.name}
          />
          <h4 className="user-name">{impresora.name}</h4>
          <p className="location">{impresora.location}</p>
          <p className="price">Tarifa: ${impresora.serviceFee}</p>
          <button
            className="toggle-form-button"
            onClick={() => toggleForm(impresora.id)}
          >
            Solicitar Servicio
          </button>
          {selectedPrinter === impresora.id && (
            <SolicitudForm
              impresorName={impresora.name}
              is3d={true}
              mailOwner={impresora.email}
              juego={""}
              precio={impresora.serviceFee}
              onClose={() => setSelectedPrinter(null)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default PiezasImpresora;
