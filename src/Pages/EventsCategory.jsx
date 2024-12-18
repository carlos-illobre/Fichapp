import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPiezas, selectAllPiezas, selectSearch, setFoundPiezasEmpresa, setFoundPiezasImpresora, setFoundPiezas, setSearch, selectIsSearching} from "../ReduxToolkit/partySlice";  // Importamos las acciones y selectores desde el slice
import Item from "../Components/Items/Item";  // Asegúrate de la ruta correcta
import Carousel from "../Components/Carousel/carousel";  // Asegúrate de la ruta correcta
import pub1 from "../Components/Assets/FotosCarousel/pub1.webp";
import pub2 from "../Components/Assets/FotosCarousel/pub2.jpg";
import pub3 from "../Components/Assets/FotosCarousel/pub3.jpg";
import "./CSS/EventsCategory.css";



import { Link, useNavigate, useLocation } from "react-router-dom";

const EventsCategory = (props) => {
  const dispatch = useDispatch();
  const piezas = useSelector(selectAllPiezas);  // Obtenemos las piezas desde Redux
  const search = useSelector(selectSearch);
  const [sortBy, setSortBy] = useState('');
  const [showEmpresaButton, setShowEmpresaButton] = useState(false); // Estado del botón de búsqueda de piezas de Empresa
  const [showImpresoraButton, setShowImpresoraButton] = useState(false); // Estado del botón de búsqueda de piezas de Empresa
  const navigate = useNavigate();
  const isSearching = useSelector(selectIsSearching);

 

  // Despachamos la acción para obtener las piezas cuando el componente se monta
  useEffect(() => {
    dispatch(fetchPiezas());
  }, [dispatch]);

  // Lógica para filtrar y ordenar los elementos según la opción seleccionada
  const filteredAndSortedPiezas = useMemo(() => {
    let filtered = piezas
      .filter(item => item.nombre && item.juego)  // Filtrar solo los elementos que tengan nombre
      .filter(item => {
        const searchTerm = search.toLowerCase();
        return (
          !searchTerm || 
          item.nombre.toLowerCase().includes(searchTerm) || 
          item.juego.toLowerCase().includes(searchTerm)  // Filtrar por nombre o por juego
        );
      });
   
  
    // Lógica de ordenamiento
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
          navigate("/PiezasImpresora"); // Ajusta la ruta según sea necesario
          setShowEmpresaButton(false);
          setShowImpresoraButton(false);
   
  };

  const handleSearchEmpresas = async () => {
    
          navigate("/PiezasEmpresa"); // Ajusta la ruta según sea necesario
          setShowEmpresaButton(false);
          setShowImpresoraButton(false);
     
  };


  
  const carouselImages = [
    pub1,
    pub2,
    pub3
  ];

  // console.log("carousel images: ", carouselImages)

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
        {filteredAndSortedPiezas.map((item, index) => {
          // if (item.category === props.category) {
            return (
              <Item
                key={index}
                id={item.id}
                name={item.juego}
                desc={item.nombre}
                image={item.image}
                // barrio={item.barrio}
                newPrice={item.price}
              />
            );
          
        })}
      </div>
      {isSearching && (
        <div className="search-buttons">
            <button onClick={handleSearchEmpresas}>
            Buscar Repuestos de Empresa
          </button>
          <button onClick={handleSearchImpresoras}>
            Buscar Servicios de Impresoras 3D
          </button>
      </div>

      )}
      
     
    </div>
    
  );
};

export default EventsCategory;