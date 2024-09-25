import React from 'react';
import './Popular.css';
import data_parties from '../Assets/data';
import Item from '../Items/Item';

const Popular = () => {
    return ( 
        <div className='popular'>
            <h1>Popular Parties</h1>
            <hr />
            <div className='popular-party'>
                {data_parties.map((party,index) => {
                    return <Item 
                                key={index} 
                                id={party.id} 
                                name={party.name} 
                                image={party.image} 
                                newPrice={party.new_price} 
                                oldPrice={party.old_price}
                            />
                })}
            </div>
        </div>
     );
}
 
export default Popular;