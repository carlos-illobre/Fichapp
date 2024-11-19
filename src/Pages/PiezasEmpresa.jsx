import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./CSS/EventsCategory.css";
import "./CSS/PiezasImpresora.css";
import {
  selectFoundPiezasEmpresa,
  fetchPiezasEmpTodas,
} from "../ReduxToolkit/partySlice";
import SolicitudForm from "./SolicitudForm";
import { useNavigate, useLocation } from "react-router-dom";

const PiezasEmpresaPage = () => {
  const dispatch = useDispatch();
  const piezasEmp = useSelector(selectFoundPiezasEmpresa);
  const [impresorasData, setImpresorasData] = useState([]);
  const [selectedJEmp, setSelectedJEmp] = useState(null);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [previousPath, setPreviousPath] = useState(null);

  const toggleForm = (piezaId) => {
    if (user.isLogged) {
      setSelectedJEmp(selectedJEmp === piezaId ? null : piezaId);
    } else {
      // Guarda la ruta actual antes de redirigir al usuario a la página de inicio de sesión
      setPreviousPath(window.location.pathname);
      navigate("/loginSignUp");
    }
  };

  useEffect(() => {
    dispatch(fetchPiezasEmpTodas());
  }, []);

  return (
    <div className="impresoras-results">
      {piezasEmp && piezasEmp.length > 0 ? (
        piezasEmp.map((pieza, index) => (
          <div key={index} className="impresora-card">
            <img
              className="impresora-image"
              src={pieza.image}
              alt={pieza.juego}
            />
            <h4 className="user-name">{pieza.juego}</h4>
            <p className="location">{pieza.barrio}</p>
            <p className="price">Tarifa: ${pieza.price}</p>
            <button
              className="toggle-form-button"
              onClick={() => toggleForm(pieza.id)}
            >
              Solicitar a Empresa
            </button>
            {selectedJEmp === pieza.id && (
              <SolicitudForm
                impresorName={pieza.nombre}
                precio={pieza.price}
                is3d={false}
                mailOwner={pieza.email}
                juego={pieza.juego}
                onClose={() => setSelectedJEmp(null)}
              />
            )}
          </div>
        ))
      ) : (
        <p>No se encontraron piezas.</p>
      )}
    </div>
  );
};

export default PiezasEmpresaPage;
