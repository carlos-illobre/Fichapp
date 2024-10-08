import React, { useMemo, useState } from "react";
import { useLoadScript } from "@react-google-maps/api"; // Cambio a useLoadScript
import "./CSS/EventsCategory.css";
import Item from "../Components/Items/Item";
import Carousel from "../Components/Carousel/carousel";
import pub1 from "../Components/Assets/FotosCarousel/pub1.webp";
import pub2 from "../Components/Assets/FotosCarousel/pub2.jpg";
import pub3 from "../Components/Assets/FotosCarousel/pub3.jpg";
import { useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase"; // Asegúrate de la ruta correcta

const EventsCategory = (props) => {

  const [parties, setParties] = useState([]);
  const [sortBy, setSortBy] = useState(null);

  // Configuración del hook useLoadScript para cargar la API de Google Maps
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyATBiLTxjMFxOAVYgVGaWMHvsC2MtQ093A",
    libraries: ["places"], 
  });

  const handleChangeSortBy = (option) => {
    setSortBy(option);
  };


  // Lógica para filtrar y ordenar los elementos según la opción seleccionada
  const filteredAndSortedParties = useMemo(() => {
    let filtered = parties.filter((item) => {
      return item.nombre.toLowerCase().includes(search.toLowerCase());
    });

    if (sortBy === "price") {
      filtered.sort((a, b) => a.price - b.price);
    }else if (sortBy === "nombre") {
    filtered.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    }


    return values;
  }, [allParties, search, sortBy]);

  const carouselImages = [pub1, pub2, pub3];

  // Si la carga de Google Maps falla, mostrar un mensaje de error
  if (loadError) return <div>Error al cargar Google Maps</div>;

  // Mostrar un mensaje de carga si la librería aún no está lista
  if (!isLoaded) return <div>Cargando mapa...</div>;


  return (
    <div className="shop-category">
      <Carousel images={carouselImages} /> 
      <img className="shopcategory-banner" src={props.banner} alt="" />
      <div className="shopcategory-indexSort">
        <p>{/* <span>Mostrando 1-12</span> de 20 resultados */}</p>
        {/* Botón desplegable para ordenar */}
        <div className="shopCategory-sort">
          Filtrar por{" "}
          <select
            className="buttonSort"
            value={sortBy}
            onChange={(e) => handleChangeSortBy(e.target.value)}
          >
            <option value="">Seleccionar</option>
            <option value="price">Precio</option>
            <option value="barrio">Ubicación</option>
          </select>
        </div>
      </div>
      <div className="shopCategory-Parties">
        {filteredAndSortedParties.map((item, index) => {

          return (
            <Item
              key={index}
              id={item.id}
              name={item.name}
              image={item.image}
              newPrice={item.new_price}
            />
          );

        })}
      </div>
    </div>
  );
};

export default EventsCategory;