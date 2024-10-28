import React, { useEffect } from "react";
import { useSelector } from "react-redux"; 
import { useParams } from "react-router-dom";
import RelatedPartys from "../Components/RelatedPartys/RelatedPartys";
import "./CSS/Partys.css";
import HeaderParty from "../Components/HeaderParty/HeaderParty";
import BotonesParty from "../Components/BotonesParty/BotonesParty";
import { selectAllPiezas } from "../ReduxToolkit/partySlice";
import Slider from 'react-slick'; // Importamos la librería del carrusel


const Partys = () => {
  const allParties = useSelector(selectAllPiezas);
  const { partyId } = useParams();
  const party = allParties.find((e) => e.id === Number(partyId));
  // const settings = {
  //   dots: true,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 1,
  //   slidesToScroll: 1
  // };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!party) {
    return <div>Loading...</div>; // Manejar el caso donde el partido no se encuentra
  }

  return (
    
        
       
      <div className = "general-page">
        <div className="product-page-container">
          {/* Imagen del producto */}
          <div className="image-container">
            <img src={party.image}  className="product-image" />
          </div>
      
          {/* Detalles del producto */}
          <div className="product-details-container">
            <h1 className="product-title">{party.juego}</h1>
            <p className="product-description">{party.nombre}</p>
            <p className="product-stock">Stock disponible: {party.stock}</p>
            <p className="product-price">Precio: ${party.price}</p>
            <p className="product-location">Ubicación: {party.barrio}</p>
            {/* <button className="buy-button">Comprar</button> */}
            <BotonesParty party={party} />
          </div>
      </div>
          <div className= "conteiner-relatedPartys">
        <RelatedPartys />
        </div>
    </div>



     
    )};
    

export default Partys;
