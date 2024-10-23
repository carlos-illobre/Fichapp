import React from 'react'
import './RelatedPartys.css'
import Item from '../Items/Item'
import { useSelector } from 'react-redux';
import { selectAllPiezas } from '../../ReduxToolkit/partySlice';

const RelatedPartys = () => {
  const allParties = useSelector(selectAllPiezas);
  const firstThreeParties = allParties.slice(3, 6);
  return (
    <div className='relatedproducts'>
      <h1>Fiestas relacionadas</h1>
      <hr />
      <div className='relatedproducts-item'>
        {firstThreeParties.map((item,i) => {
            return <Item
            key={i}
            id={item.id}
            name={item.juego}
            desc={item.nombre}
            image={item.image}
            barrio={item.barrio}
            newPrice={item.price}
          />
        })}
      </div>
    </div>
  )
}

export default RelatedPartys
