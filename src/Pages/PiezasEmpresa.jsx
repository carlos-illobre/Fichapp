import React from 'react';
import { useSelector } from 'react-redux';  // Importamos el selector para obtener las piezas
import { selectFoundPiezasEmpresa } from '../ReduxToolkit/partySlice';  // Importamos el selector para obtener las piezas encontradas
import Item from "../Components/Items/Item";
import "./CSS/EventsCategory.css";

const PiezasEmpresaPage = () => {
const piezasEmp = useSelector(selectFoundPiezasEmpresa);  // Obtenemos las piezas desde Redux

return (
  <div className="shopCategory-Parties">
    {piezasEmp && piezasEmp.length > 0 ? (
        piezasEmp.map((pieza) => (
            <div>
              <Item
              key={pieza.id}
              id={pieza.id}
              name={pieza.empresa}
              image={pieza.image}
              newPrice={pieza.price}
              desc={pieza.barrio}
            />
            </div>
          ))

    ) : (
      <p>No se encontraron piezas.</p>
    )}
  </div>
);
};

export default PiezasEmpresaPage;