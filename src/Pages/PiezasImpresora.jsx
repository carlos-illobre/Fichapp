import React from 'react';
import { useSelector } from 'react-redux';  // Importamos el selector para obtener las piezas
import { selectFoundPiezasImpresora } from '../ReduxToolkit/partySlice';  // Importamos el selector para obtener las piezas encontradas
import Item from "../Components/Items/Item";

const PiezasImpresoraPage = () => {
const piezasImpresora = useSelector(selectFoundPiezasImpresora);  // Obtenemos las piezas desde Redux

return (
  <div>
    <h1>Piezas de impresoras 3D</h1>
    {piezasImpresora && piezasImpresora.length > 0 ? (
      <ul>
        {piezasImpresora.map((pieza) => {
          console.log("Datos de pieza:", pieza); // Verifica los datos en consola

          return (
            <div key={pieza.id} className="pieza-container">
              <Item
              key={pieza.id}
              id={pieza.id}
              name={ 
                `Empresa: ${pieza.impresora} - Ubicación: ${pieza.ubicacion}`
              }
              image={pieza.image}
              newPrice={pieza.precio}
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

export default PiezasImpresoraPage;