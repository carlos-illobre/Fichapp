import React from 'react';
import { useSelector } from 'react-redux';  // Importamos el selector para obtener las piezas
import { selectFoundPiezas } from '../ReduxToolkit/partySlice';  // Importamos el selector para obtener las piezas encontradas
const PiezasPage = () => {
  const piezas = useSelector(selectFoundPiezas);  // Obtenemos las piezas desde Redux

  return (
    <div>
      <h1>Resultados de Piezas</h1>

      {piezas && piezas.length > 0 ? (
        <ul>
          {piezas.map((pieza) => (
            <li key={pieza.id}>
              <h3>{pieza.nombre}</h3>
              <p>{pieza.juego}</p>
              <p>{pieza.descripcion}</p>
              <p>Precio: {pieza.price} $</p>
              <img 
                src={pieza.image}  // Asegúrate de que 'imagen' sea la propiedad correcta
                alt={pieza.nombre}
                style={{ width: '200px', height: '200px' }}  // Ajusta el tamaño según sea necesario
              />

            </li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron piezas.</p>
      )}
    </div>
  );
};

export default PiezasPage;
