import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import "./CSS/EventsCategory.css";
import Item from "../Components/Items/Item";
import Carousel from "../Components/Carousel/carousel";
import pub1 from "../Components/Assets/FotosCarousel/pub1.webp";
import pub2 from "../Components/Assets/FotosCarousel/pub2.jpg";
import pub3 from "../Components/Assets/FotosCarousel/pub3.jpg";
import { selectAllParties, selectSearch } from "../ReduxToolkit/partySlice";

const EventsCategory = (props) => {

  const allParties = useSelector(selectAllParties);
  const search = useSelector(selectSearch) || '';
  const [sortBy, setSortBy] = useState(null);


  const handleChangeSortBy = (option) => {
    setSortBy(option);
  };
 

  // Lógica para filtrar y ordenar los elementos según la opción seleccionada
  const filteredAndSortedParties = useMemo(() => {
    let values = allParties.filter((item) => {
      return item.name.toLowerCase().includes(search.toLowerCase());
    });

    if (sortBy === "price") {
      values.sort((a, b) => a.new_price - b.new_price); // Ordenar por precio
    } else if (sortBy === "date") {
      values.sort((a, b) => new Date(a.fecha) - new Date(b.fecha)); // Ordenar por fecha
    }

    return values;
  }, [allParties, search, sortBy]);

  const carouselImages = [pub1, pub2, pub3];


  return (
    <div className="shop-category">
      <Carousel images={carouselImages} />
      <img className="shopcategory-banner" src={props.banner} alt="" />
      <div className="shopcategory-indexSort">
        <p>{/* <span>Mostrando 1-12</span> de 20 resultados */}</p>
        <div className="shopCategory-sort">
          Filtrar por{" "}
          <select
            className="buttonSort"
            value={sortBy}
            onChange={(e) => handleChangeSortBy(e.target.value)}
          >
            <option value="">Seleccionar</option>
            <option value="price">Precio</option>
            <option value="date">Ubicación</option>
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
