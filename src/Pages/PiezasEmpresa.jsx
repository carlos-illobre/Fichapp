import React from 'react';
import { useSelector } from 'react-redux';  // Importamos el selector para obtener las piezas
import { selectFoundPiezasEmpresa } from '../ReduxToolkit/partySlice';  // Importamos el selector para obtener las piezas encontradas
import Item from "../Components/Items/Item";

const PiezasEmpresaPage = () => {
const piezasEmp = useSelector(selectFoundPiezasEmpresa);  // Obtenemos las piezas desde Redux

return (
  <div>
    <h1>Piezas de Empresa</h1>
    {piezasEmp && piezasEmp.length > 0 ? (
      <ul>
        {piezasEmp.map((pieza) => {
          console.log("Datos de pieza:", pieza); // Verifica los datos en consola

          return (
            <div key={pieza.id} className="pieza-container">
              <Item
              key={pieza.id}
              id={pieza.id}
              name={
              `Empresa: ${pieza.empresa} - Ubicación: ${pieza.barrio}`}
              image={pieza.image}
              newPrice={pieza.price}
              desc={""}
            />
            </div>
          );
        })}
      </ul>
    ) : (
      <p>No se encontraron piezas.</p>
    )}
  </div>
);
};

export default PiezasEmpresaPage;