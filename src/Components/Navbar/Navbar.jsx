// src/Components/Navbar/Navbar.jsx

import React, { useState } from "react";
import "./Navbar.css";
import logo from "../Assets/logoFichapp.jpeg";
import cart_icon from "../Assets/cart2.jpg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import lupa from "../Assets/lupa.png";
import { IconButton } from "@mui/material";
import { setSearch, selectSearch } from "../../ReduxToolkit/partySlice";
import { useSelector, useDispatch } from "react-redux";
import { setUser, clearUser } from "../../ReduxToolkit/userSlice";
import { removeFromCart, removeAllFromCart, selectTotalCartItems } from "../../ReduxToolkit/cartSlice";
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

  const handleChangeSearch = (event) => {
    const value = event.target.value;
    setLocalSearch(value);
    if (!value.length) {
      dispatch(setSearch(""));
    }
    if (value.length >= 3) {
      dispatch(setSearch(value));
    }
  };

  const handleClickSearch = () => {
    if (localSearch.length >= 3) {
      dispatch(setSearch(localSearch));
      navigate("/recintos");
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
      <ul className={`nav-menu ${menu ? "show" : ""}`}>
        <li onClick={() => setMenu("recintos")}>
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
            placeholder="Search..."
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
