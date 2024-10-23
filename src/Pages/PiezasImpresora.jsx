import React from 'react';
import { useSelector } from 'react-redux';  // Importamos el selector para obtener las piezas
import { selectFoundPiezasImpresora } from '../ReduxToolkit/partySlice';  // Importamos el selector para obtener las piezas encontradas
import Item from "../Components/Items/Item";
import "./CSS/EventsCategory.css";

const PiezasImpresoraPage = () => {
const piezasImpresora = useSelector(selectFoundPiezasImpresora);  // Obtenemos las piezas desde Redux

return (
  <div className="shopCategory-Parties">
    {piezasImpresora && piezasImpresora.length > 0 ? (
        piezasImpresora.map((pieza) => (
            <div >
              <Item
              key={pieza.id}
              id={pieza.id}
              name={ pieza.impresora}
              image={pieza.image}
              newPrice={pieza.precio}
              desc={pieza.ubicacion}
            />
            </div>
          ))
      
    ) : (
      <p>No se encontraron piezas.</p>
    )}
  </div>
);
};

export default PiezasImpresoraPage;