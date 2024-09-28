import React, { useState} from "react";
import "./Navbar.css";
import logo from "../Assets/logoFichapp.jpeg";
import cart_icon from "../Assets/cart2.jpg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import lupa from "../Assets/lupa.png";
import { IconButton } from "@mui/material";
import { setSearch, selectSearch } from "../../ReduxToolkit/partySlice";
import { useSelector, useDispatch } from "react-redux";
import { setUser, clearUser  } from "../../ReduxToolkit/userSlice"; // eslint-disable-line no-unused-vars
import { removeFromCart, removeAllFromCart, selectTotalCartItems } from "../../ReduxToolkit/cartSlice"; // eslint-disable-line no-unused-vars

const Nabvar = () => {
  const dispatch = useDispatch();
  const search = useSelector(selectSearch) || ''; // eslint-disable-line no-unused-vars
  const [menu, setMenu] = useState("recintos");   // eslint-disable-line no-unused-vars
  const user = useSelector(state => state.user);
  const [localSearch, setLocalSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const totalCartItems = useSelector(selectTotalCartItems);

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
      navigate("/recintos"); // Ajusta la ruta según sea necesario
    }
  };

  const handleContinuarClick = () => {
    dispatch(clearUser());
    dispatch(removeAllFromCart());
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="logo" className="logoshopper" />
      </div>
      {/* Botón de hamburguesa */}
      <button className="menu-icon" onClick={() => setShowMenu(!showMenu)}>
        <div className="menu-icon-lines"></div>
        <div className="menu-icon-lines"></div>
        <div className="menu-icon-lines"></div>
      </button>
      <ul className={`nav-menu ${showMenu ? "show" : ""}`}>
        <li onClick={() => setMenu("recintos")}>
          <Link to="/">INICIO</Link>
        </li>

        {user.role === "ADMIN" && (
          <li onClick={() => setMenu("AgregarFiesta")}>
            <Link to="/agregarFiesta">AGREGAR PUBLICACIÓN</Link>
          </li>
        )}

        {user.isLogged ? (
          <>
            <div className="loginName">
              <p>HOLA, {user.name}!</p>
            </div>
            <div>
              <button className="logout-button" onClick={handleContinuarClick}>
                CERRAR SESIÓN
              </button>
            </div>
          </>
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

export default Nabvar;
