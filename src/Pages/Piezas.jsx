import React from 'react';
import { useSelector } from 'react-redux';  // Importamos el selector para obtener las piezas
import { selectFoundPiezas } from '../ReduxToolkit/partySlice';  // Importamos el selector para obtener las piezas encontradas
import Item from "../Components/Items/Item";

const PiezasPage = () => {
const piezas = useSelector(selectFoundPiezas);  // Obtenemos las piezas desde Redux

  return (
    <div>
      {piezas && piezas.length > 0 ? (
        <ul>
          {piezas.map((pieza) => (
            <Item
            key={pieza.id}
            id={pieza.id}
            name={pieza.juego}
            image={pieza.image}
            newPrice={pieza.price}
          />
          ))}
        </ul>
      ) : (
        <p>No se encontraron piezas.</p>
      )}
    </div>
  );
};

export default PiezasPage;