// src/Components/Navbar/Navbar.jsx

import React, { useState } from "react";
import "./Navbar.css";
import logo from "../Assets/logoFichapp.jpeg";
import cart_icon from "../Assets/cart2.jpg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import lupa from "../Assets/lupa.png";
import { IconButton } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { setFoundPiezas, setFoundPiezasEmpresa, setFoundPiezasImpresora, setSearch, selectSearch } from "../../ReduxToolkit/partySlice";
import { clearUser } from "../../ReduxToolkit/userSlice";
import { removeAllFromCart, selectTotalCartItems } from "../../ReduxToolkit/cartSlice";
import { getAuth, signOut } from "firebase/auth";
import { FaChevronDown } from "react-icons/fa";


const Navbar = () => {
  const dispatch = useDispatch();
  const search = useSelector(selectSearch) || "";
  const [menu, setMenu] = useState("recintos");
  const user = useSelector((state) => state.user);
  const [localSearch, setLocalSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false); // Estado para controlar el menú desplegable
  const navigate = useNavigate();
  const location = useLocation();
  const totalCartItems = useSelector(selectTotalCartItems);
  const auth = getAuth();

  const [showEmpresaButton, setShowEmpresaButton] = useState(false); // Estado del botón de búsqueda de piezas de Empresa
  const [showImpresoraButton, setShowImpresoraButton] = useState(false); // Estado del botón de búsqueda de piezas de Empresa
 

  const handleChangeSearch = (event) => {
    const value = event.target.value;
    setLocalSearch(value);
    if (!value.length) {
      dispatch(setSearch(""));
    }
    if (value.length >= 3) {
      dispatch(setSearch(value));
    }
    handleSearchEmpresas();
  };

  const handleClickSearch = async () => {
    if (localSearch.length >= 3) {
      // Realizamos la búsqueda en Firestore dentro de la colección "piezas"
      const piezasCollection = collection(db, 'piezas');
      const queryPieza = query(piezasCollection, where('nombre', '==', localSearch), where('esEmpresa', '==', false));
      const queryJuego = query(piezasCollection, where('juego', '==', localSearch), where('esEmpresa', '==', false));

      try {
        const querySnapshotPieza = await getDocs(queryPieza);
        const querySnapshotJuego= await getDocs(queryJuego);

        const piezas = [];
        const juegos = [];
        
        querySnapshotPieza.forEach((doc) => {
          piezas.push({ id: doc.id, ...doc.data() });
        });

        querySnapshotJuego.forEach((doc) => {
          juegos.push({ id: doc.id, ...doc.data() });
        });

        handleSearchEmpresas();
      handleSearchImpresoras();

        // Si obtienes piezas, podrías redirigir a una página de resultados o mostrar las piezas
        if (piezas.length > 0) { // Para piezas
          console.log("Piezas encontradas:", piezas); 
          dispatch(setFoundPiezas(piezas)); // Opcional: Guarda el término de búsqueda en Redux
          navigate("/"); // Ajusta la ruta según sea necesario
        } else {
          console.log("No se encontraron piezas.");
          dispatch(setFoundPiezas([]));
          navigate("/Piezas");
        }
        if (juegos.length > 0) { // Para juegos
          console.log("Juegos encontrados:", juegos);
          dispatch(setFoundPiezas(juegos)); // Opcional: Guarda el término de búsqueda en Redux
          navigate("/"); // Ajusta la ruta según sea necesario
          setShowEmpresaButton(true); //Mostrar boton Piezas de Empresa
          setShowImpresoraButton(true);
        } else {
          console.log("No se encontraron juegos.")
          setShowEmpresaButton(true); //Mostrar boton Piezas de Empresa
          setShowImpresoraButton(true);
        }
      } catch (error) {
        console.error("Error al realizar la búsqueda:", error);
      }
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        dispatch(clearUser());
        dispatch(removeAllFromCart());
        navigate("/"); // Redirigir a la página de inicio después de cerrar sesión
      })
      .catch((error) => {
        console.error("Error al cerrar la sesión:", error);
        alert("Error al cerrar la sesión");
      });
  };

  const handleSearchImpresoras = async () => {
    if (localSearch.length >= 3) {
      // Realizamos la búsqueda en Firestore dentro de la colección "piezas"
      const piezasCollection = collection(db, 'impresoras');
      const queryImpresora = query(piezasCollection);

      try {
        const querySnapshotImpresora = await getDocs(queryImpresora);

        const impresoras = [];
        
        querySnapshotImpresora.forEach((doc) => {
          impresoras.push({ id: doc.id, ...doc.data() });
        });

        // Si obtienes piezas, podrías redirigir a una página de resultados o mostrar las piezas
        if (impresoras) { // Para piezas
          console.log("Impresoras 3D encontradas:", impresoras); 
          dispatch(setFoundPiezasImpresora(impresoras)); // Opcional: Guarda el término de búsqueda en Redux
          // navigate("/PiezasImpresora"); // Ajusta la ruta según sea necesario
          setShowEmpresaButton(false);
          setShowImpresoraButton(false);
        }
      } catch (error) {
        console.error("Error al realizar la búsqueda:", error);
      }
    }
  };

  const handleSearchEmpresas = async () => {
    if (localSearch.length >= 3) {
      // Realizamos la búsqueda en Firestore dentro de la colección "pubEmpresas"
      const piezasCollection = collection(db, 'pubEmpresas');
      const queryPiezaEmp = query(piezasCollection)
      const queryJuegoEmp = query(piezasCollection)
      

      try {
        const querySnapshotPieza = await getDocs(queryPiezaEmp);
        const querySnapshotJuego= await getDocs(queryJuegoEmp);

        const piezasEmp = [];
        const juegosEmp = [];
        
        console.log('elisheba' + piezasEmp);

        querySnapshotPieza.forEach((doc) => {
          piezasEmp.push({ id: doc.id, ...doc.data() });
        });

        querySnapshotJuego.forEach((doc) => {
          juegosEmp.push({ id: doc.id, ...doc.data() });
        });

        // Si obtienes piezas, podrías redirigir a una página de resultados o mostrar las piezas
        if (piezasEmp.length > 0) { // Para piezas
          console.log("Piezas encontradas:", piezasEmp); 
          dispatch(setFoundPiezasEmpresa(piezasEmp)); // Opcional: Guarda el término de búsqueda en Redux
          // navigate("/PiezasEmpresa"); // Ajusta la ruta según sea necesario
        } else {
          console.log("No se encontraron piezas.");
          dispatch(setFoundPiezasEmpresa([]));
          // navigate("/PiezasEmpresa");
        }
        if (juegosEmp.length > 0) { // Para juegos
          console.log("Juegos encontrados:", juegosEmp);
          dispatch(setFoundPiezasEmpresa(juegosEmp)); // Opcional: Guarda el término de búsqueda en Redux
          // navigate("/PiezasEmpresa"); // Ajusta la ruta según sea necesario
          setShowEmpresaButton(false);
          setShowImpresoraButton(false);
        } else {
          console.log("No se encontraron juegos.");
          setShowEmpresaButton(false);
          setShowImpresoraButton(false);
        }
      } catch (error) {
        console.error("Error al realizar la búsqueda:", error);
      }
    }
  };

  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="logo" className="logoshopper" />
      </div>
      <button className="menu-icon" onClick={() => setMenu(!menu)}>
        <div className="menu-icon-lines"></div>
        <div className="menu-icon-lines"></div>
        <div className="menu-icon-lines"></div>
      </button>
      <ul className={'nav-menu ${showMenu ? "show" : ""}'}>
        <li onClick={() => {setMenu("Piezas"); setShowEmpresaButton(false);
          setShowImpresoraButton(false);}}>
          <Link to="/">INICIO</Link>
        </li>

        {/* Eliminar este bloque de código para el botón de Agregar Fiesta */}
        {/*
        {user.role === "ADMIN" && (
          <li onClick={() => setMenu("AgregarFiesta")}>
            <Link to="/agregarFiesta">AGREGAR PUBLICACIÓN</Link>
          </li>
        )}
        */}
        {user.isLogged ? (
          <div className="user-dropdown">
            <span className="dropdown-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
              HOLA, {user.name}! <FaChevronDown className="dropdown-icon" />
            </span>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <ul>
                  <li
                    onClick={() => {
                      navigate("/user-profile");
                      setDropdownOpen(false); // Cerrar el menú desplegable
                    }}
                  >
                    Ver Perfil
                  </li>
                  <li
                    onClick={() => {
                      handleLogout();
                      setDropdownOpen(false); // Cerrar el menú desplegable
                    }}
                  >
                    Cerrar Sesión
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <li onClick={() => setMenu("login")}>
            <Link to="/loginSignUp">INGRESAR / REGISTRARSE</Link>
          </li>
        )}
      </ul>
      {!location.pathname.includes("partys") &&
      !location.pathname.includes("login") &&
      !location.pathname.includes("cart") &&
      !location.pathname.includes("agregarFiesta") ? (
        <div className="nav-search">
          <input
            type="text"
            placeholder="Buscar..."
            onChange={handleChangeSearch}
          />
          <IconButton onClick={handleClickSearch}>
            <img src={lupa} alt="search" />
          </IconButton>
        </div>
      ) : null}
       
      <Link className="nav-login-cart" to="/cart">
        <img src={cart_icon} alt="" className="logocart" />
        <div className="nav-cart-count">{totalCartItems}</div>
      </Link>
    </div>
  );
};

export default Navbar;
