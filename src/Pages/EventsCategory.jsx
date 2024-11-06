import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { fetchPiezas, selectAllPiezas, selectSearch, selectIsSearching } from "../ReduxToolkit/partySlice";
import Item from "../Components/Items/Item";
import Carousel from "../Components/Carousel/carousel";
import pub1 from "../Components/Assets/FotosCarousel/pub1.webp";
import pub2 from "../Components/Assets/FotosCarousel/pub2.jpg";
import pub3 from "../Components/Assets/FotosCarousel/pub3.jpg";
import "./CSS/EventsCategory.css";
import { useNavigate } from "react-router-dom";

const EventsCategory = (props) => {
  const dispatch = useDispatch();
  const piezas = useSelector(selectAllPiezas);
  const search = useSelector(selectSearch);
  const [sortBy, setSortBy] = useState('');
  const [impresorasData, setImpresorasData] = useState([]);
  const navigate = useNavigate();
  const isSearching = useSelector(selectIsSearching);

  useEffect(() => {
    dispatch(fetchPiezas());
  }, [dispatch]);

  const filteredAndSortedPiezas = useMemo(() => {
    let filtered = piezas
      .filter(item => item.nombre && item.juego)
      .filter(item => {
        const searchTerm = search.toLowerCase();
        return (
          !searchTerm || 
          item.nombre.toLowerCase().includes(searchTerm) || 
          item.juego.toLowerCase().includes(searchTerm)
        );
      });

    if (sortBy === "price") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "nombre") {
      filtered.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    }

    return filtered;
  }, [piezas, search, sortBy]);

  const handleChangeSortBy = (option) => {
    setSortBy(option);
  };

  const handleSearchImpresoras = async () => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("is3DService", "==", true));
      const querySnapshot = await getDocs(q);
      const impresoras = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        impresoras.push({
          userName: data.name || "Usuario sin nombre", // Asegurarse de que haya un nombre
          location: data.printerData?.location || "Sin ubicación",
          serviceFee: data.printerData?.serviceFee || "Sin tarifa",
          printerPhoto: data.printerData?.printerPhoto || "https://via.placeholder.com/250", // Placeholder si no hay imagen
        });
      });

      setImpresorasData(impresoras.sort((a, b) => a.userName.localeCompare(b.userName)));
      navigate("/PiezasImpresora"); // Navega a la página de resultados
    } catch (error) {
      console.error("Error al buscar impresoras en Firebase:", error);
    }
  };

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
            <option value="barrio">Ubicación</option>
          </select>
        </div>
      </div>
      <div className="shopCategory-Parties">
        {filteredAndSortedPiezas.map((item, index) => (
          <Item
            key={index}
            id={item.id}
            name={item.juego}
            desc={item.nombre}
            image={item.image}
            newPrice={item.price}
          />
        ))}
      </div>
      {isSearching && (
        <div className="search-buttons">
          <button className="empresa-button">Buscar Repuestos de Empresa</button>
          <button className="impresora-button" onClick={handleSearchImpresoras}>
            Buscar Servicios de Impresoras 3D
          </button>
        </div>
      )}
      {impresorasData.length > 0 && (
        <div className="impresoras-results">
          {impresorasData.map((impresora, index) => (
            <div key={index} className="impresora-card">
              <img className="impresora-image" src={impresora.printerPhoto} alt={impresora.userName} />
              <h4 className="user-name">{impresora.userName}</h4> {/* Nombre de usuario en negrita */}
              <p className="location">{impresora.location}</p>
              <p className="price">Tarifa: ${impresora.serviceFee}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsCategory;
