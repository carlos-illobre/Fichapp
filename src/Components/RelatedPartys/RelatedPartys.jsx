import React from 'react'
import './RelatedPartys.css'
import Item from '../Items/Item'
import { useSelector } from 'react-redux';
import { selectAllPiezas } from '../../ReduxToolkit/partySlice';

const RelatedPartys = () => {
  const allParties = useSelector(selectAllPiezas);
  const firstThreeParties = allParties.slice(3, 7);
  return (
    <div className='relatedproducts'>
      <h1>Fiestas relacionadas</h1>
      <hr />
      <div className='relatedproducts-item'>
        {firstThreeParties.map((item,i) => {
            return <Item key={i} 
                id={item.id} 
                name={item.name} 
                image={item.image} 
                newPrice={item.new_price} 
                oldPrice={item.old_price}/>
        })}
      </div>
    </div>
  )
}

export default RelatedPartys
