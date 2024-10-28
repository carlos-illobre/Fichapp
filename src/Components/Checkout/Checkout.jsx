import React, {  useState } from "react";
import "./Checkout.css";
import paypal from "../Assets/card_img.png";
import { useSelector, useDispatch } from "react-redux";
import {
  selectTotalCartAmount,
  selectDiscount,
  removeFromCart,
  removeAllFromCart,
  selectCartItems
} from "../../ReduxToolkit/cartSlice";
import { selectAllPiezas, descountStockParty } from '../../ReduxToolkit/partySlice';

const Checkout = () => {
  const cartItems = useSelector(selectCartItems);
  const discountApplied = useSelector(selectDiscount); // eslint-disable-line no-unused-vars
  const totalAmount = useSelector(selectTotalCartAmount);
  const dispatch = useDispatch();
  const allParties = useSelector(selectAllPiezas);


  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(""); // New state for email error message
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [code, setCode] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    const isValidEmail = /\S+@\S+\.\S+/.test(value);
    if (!isValidEmail) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
    }
    setEmail(value);
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 16);
    setCardNumber(value);
  };

  const handleExpirationDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 6);
    const formattedValue = value.replace(/(\d{2})(\d{0,4})/, "$1/$2");
    setExpirationDate(formattedValue);
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    const maxLength = cardNumber.startsWith("3") ? 4 : 3;
    setCvv(value.slice(0, maxLength));
  };

  const handleRemoveFromCart = (partyId) => {
    dispatch(removeFromCart(partyId));
  };

  const handleDescountStock = () => {   //TODO
    for (const partyId in cartItems) {
      const party = allParties.find((party) => party.id === parseInt(partyId));
      if (party && cartItems[partyId] > 0) {
        descountStockParty(party.id, cartItems[partyId]);
      }
    }
    if (!isValidCVV(cvv) || !isValidCardNumber(cardNumber) || emailError) {
      alert("Invalid data, please enter them correctly");
      return;
    } else {
      setFullName("");
      setEmail("");
      setAddress("");
      setCity("");
      setState("");
      setCode("");
      setCardNumber("");
      setExpirationDate("");
      setCvv("");
      handleRemoveAllCart();
      setShowSuccessMessage(true);
    }
  };

  const handleRemoveAllCart = () => {
    dispatch(removeAllFromCart());
  };

  const isValidCVV = (cvv) => {
    return /^\d{3}$/.test(cvv);
  };

  const isValidString = (value) => { // eslint-disable-line no-unused-vars
    return typeof value === "string" && value.trim() !== "";
  };

  const isValidCardNumber = (cardNumber) => {
    return /^\d{16}$/.test(cardNumber);
  };

  return (
    <div className="checkout-container">
      <div className="billing-address">
        <h3 className="title">Datos del cliente</h3>
        <div className="input-box">
          <span>Nombre Completo:</span>
          <input
            type="text"
            name="full-name"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="input-box">
          <span>Email:</span>
          <input
            type="email"
            name="email"
            placeholder="example@example.com"
            value={email}
            onChange={handleEmailChange}
          />
          {emailError && <p className="error-message">{emailError}</p>}
        </div>
        
        
       
      </div>
      <div className="payment-details">
        <h3 className="title">Pago</h3>

        <div className="inputBox">
          <span>Tarjetas aceptadas :</span>
          <img src={paypal} alt="paypal" />
        </div>
        <div className="input-box">
          <span>Numero de la tarjeta:</span>
          <input
            type="text"
            name="card-number"
            placeholder="1111-2222-3333-4444"
            value={cardNumber}
            onChange={handleCardNumberChange}
          />
        </div>
        <div className="input-box">
          <span>Fecha de expiracion:</span>
          <input
            type="text"
            name="expiration-date"
            placeholder="MM/YYYY"
            value={expirationDate}
            onChange={handleExpirationDateChange}
          />
        </div>
        <div className="input-box">
          <span>CVV:</span>
          <input
            type="text"
            name="cvv"
            placeholder="123"
            value={cvv}
            onChange={handleCvvChange}
          />
        </div>
      </div>
      <div className="checkout-parties">
        <h3>Resumen:</h3>
        {cartItems.length > 0 ? (
          cartItems.map((item) => {
            const party = allParties.find((party) => party.id === item.id);
            if (party) {
              return (
                <div className="checkout-parties-item" key={party.id}>
                  <p>{party.juego}</p>
                  <p>Cantidad: {item.cantidad}</p>
                  <p>Total: ${party.price * item.cantidad}</p>
                  <button onClick={() => handleRemoveFromCart(party.id)}>
                    Eliminar
                  </button>
                </div>
              );
            }
            return null;
          })
        ) : (
          <p>No hay items en el carrito</p>
        )}
      </div>
      <div className="checkout-total">
        <p>Subtotal: ${totalAmount}</p>
        <p>Total: ${totalAmount}</p>
        <button onClick={() => handleDescountStock()}>Comprar</button>
      </div>

      {showSuccessMessage && (
        <div className="success-message">
          <h2>Compra Exitosa!</h2>
          <p>Va a recibir toda la informacion de su compra por email.</p>
        </div>
      )}
    </div>
  );
};

export default Checkout;
