import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./CSS/EventsCategory.css";
import "./CSS/PiezasImpresora.css";
import {
  selectFoundPiezasEmpresa,
  fetchPiezasEmpTodas,
} from "../ReduxToolkit/partySlice";
import SolicitudForm from "./SolicitudForm";

const PiezasEmpresaPage = () => {
  const dispatch = useDispatch();
  const piezasEmp = useSelector(selectFoundPiezasEmpresa);
  const [impresorasData, setImpresorasData] = useState([]);
  const [selectedJEmp, setSelectedJEmp] = useState(null);

  const toggleForm = (piezaId) => {
    setSelectedJEmp(selectedJEmp === piezaId ? null : piezaId);
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
                impresorId={pieza.id}
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
