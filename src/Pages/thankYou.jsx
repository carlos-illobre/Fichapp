import React from "react";
import { Link } from "react-router-dom";
import "./CSS/ThankYou.css";

const ThankYou = () => {
  return (
    <div className="thank-you">
      <div className="thank-you-container">
        <h1>¡Gracias por tu compra!</h1>
        <p>En breve recibirás un correo con todos los detalles de tu compra.</p>
        <Link to="/" className="thank-you-button">
          Volver a la página principal
        </Link>
      </div>
    </div>
  );
};

export default ThankYou;
