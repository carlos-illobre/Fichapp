import "./BotonesParty.css";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { deleteParty } from "../../ReduxToolkit/partySlice";
import { useSelector,useDispatch } from "react-redux";
import { addToCart, selectTotalCartItems } from "../../ReduxToolkit/cartSlice";

const BotonesParty = (props) => {
  const { party} = props;
  const user = useSelector((state) => state.user);
  const totalCartItems = useSelector(selectTotalCartItems);
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const [previousPath, setPreviousPath] = useState(null);
  const dispatch = useDispatch();
  

  const handleCantidadChange = (event) => {
    const cantidad = parseInt(event.target.value);
    setCantidadSeleccionada(cantidad);
  };
  const VerificarStock = (cantidadSeleccionada) => {
    return cantidadSeleccionada <= party.stock;
  };

  const handleAgregarAlCarrito = () => {
    if (user.isLogged) {
      dispatch(addToCart({ ...party, cantidad: cantidadSeleccionada }));
    } else {
      // Guarda la ruta actual antes de redirigir al usuario a la página de inicio de sesión
      setPreviousPath(window.location.pathname);
      navigate("/loginSignUp");
    }
  };
  const esAdmin = () => {
    if (user.role === "ADMIN") {
      return true;
    } else {
      return false;
    }
  };
  const handlemodificarFiesta = () => {
    navigate("/modificarFiesta", { state: { party } });
  };

  const handleEliminarFiesta = () => {
    // const partyId = location.pathname.split("/").pop();
    const partyId = party.id;
    console.log("ID de la party a eliminar: ", partyId);
    dispatch(deleteParty(partyId));
    navigate("/");
  };

  return (
    <div>
      <div className="barraBotones">
        <div className="boton">
          <select id="fecha" className="estiloBoton">
            <option selected>{party.fecha}</option>
          </select>
        </div>
        <div className="boton">
          <select id="hora" className="estiloBoton">
            <option selected>{party.hora}</option>
          </select>
        </div>
        <div className="boton">
          <select id="lugar" className="estiloBoton">
            <option selected>{party.lugar}</option>
            <option>{party.ubicacion}</option>
          </select>
        </div>
        <div className="boton">
          <select id="precio" className="estiloBoton">
            <option selected>{"$" + party.new_price}</option>
          </select>
        </div>
        <div className="boton">
          <select
            id="cantidad"
            className="estiloBoton"
            value={cantidadSeleccionada}
            onChange={handleCantidadChange}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </div>
      </div>

      {esAdmin() ? (
        <div className="ComprarPartyButton">
          <button
            className="botonComprar aviable"
            onClick={ handlemodificarFiesta}
          >
            MODIFICAR FIESTA
          </button>
          <button
            className="botonComprar aviable"
            onClick={handleEliminarFiesta}
          >
            ELIMINAR FIESTA
          </button>
        </div>
      ) : VerificarStock(cantidadSeleccionada) ? (
        <div className="ComprarPartyButton">
          <button
            onClick={handleAgregarAlCarrito}
            className="botonComprar aviable"
          >
            AGREGAR AL CARRITO
          </button>
        </div>
      ) : (
        <div className="ComprarPartyButton">
          <button className="botonComprar disable"> AGREGAR AL CARRITO</button>
        </div>
      )}
    </div>
  );
};

export default BotonesParty;
