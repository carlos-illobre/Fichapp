import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import "./CSS/PiezasImpresora.css";

const PiezasImpresora = () => {
  const [impresorasData, setImpresorasData] = useState([]);

  useEffect(() => {
    const fetchImpresorasData = async () => {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("is3DService", "==", true));
        const querySnapshot = await getDocs(q);
        const impresoras = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          impresoras.push({
            name: data.name || "Usuario sin nombre", // Obtener el nombre directamente de data
            location: data.printerData?.location || "Sin ubicación",
            serviceFee: data.printerData?.serviceFee || "Sin tarifa",
            printerPhoto: data.printerData?.printerPhoto || "https://via.placeholder.com/250", // Placeholder si no hay imagen
          });
        });

        setImpresorasData(impresoras.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        console.error("Error al buscar impresoras en Firebase:", error);
      }
    };

    fetchImpresorasData();
  }, []);

  return (
    <div className="impresoras-results">
      {impresorasData.map((impresora, index) => (
        <div key={index} className="impresora-card">
          <img className="impresora-image" src={impresora.printerPhoto} alt={impresora.name} />
          <h4 className="user-name">{impresora.name}</h4> {/* Nombre en negrita */}
          <p className="location">{impresora.location}</p>
          <p className="price">Tarifa: ${impresora.serviceFee}</p>
        </div>
      ))}
    </div>
  );
};

export default PiezasImpresora;
