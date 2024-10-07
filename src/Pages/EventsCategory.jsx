import React, { useMemo, useState } from "react";
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
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "piezas"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const piezasArray = [];
      querySnapshot.forEach((doc) => {
        piezasArray.push({ id: doc.id, ...doc.data() });
        console.log("i")
      });
      setParties(piezasArray);
    });

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

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

    return filtered;
  }, [parties, search, sortBy]);

   // Funciones de control
   const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleChangeSortBy = (option) => {
    setSortBy(option);
  };

  
  const carouselImages = [
    pub1,
    pub2,
    pub3
  ];

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
          // if (item.category === props.category) {
            return (
              <Item
                key={index}
                id={item.id}
                nombre={item.nombre}
                image={item.image}
                barrio={item.barrio}
                // Render price information conditionally
                newPrice={item.price}
                // oldPrice={
                //   props.category === "artistas" ? null : `${item.old_price}`
                // }
              />
            );
          // } else {
          //   return null;
          // }
        })}
      </div>
    </div>
  );
};

export default EventsCategory;