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
import { selectAllParties, descountStockParty } from '../../ReduxToolkit/partySlice';

const Checkout = () => {
  const cartItems = useSelector(selectCartItems);
  const discountApplied = useSelector(selectDiscount);
  const totalAmount = useSelector(selectTotalCartAmount);
  const dispatch = useDispatch();
  const allParties = useSelector(selectAllParties);


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

  const isValidString = (value) => {
    return typeof value === "string" && value.trim() !== "";
  };

  const isValidCardNumber = (cardNumber) => {
    return /^\d{16}$/.test(cardNumber);
  };

  return (
    <div className="checkout-container">
      <div className="billing-address">
        <h3 className="title">Billing Address</h3>
        <div className="input-box">
          <span>Full Name:</span>
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
        <div className="input-box">
          <span>Address:</span>
          <input
            type="text"
            name="address"
            placeholder="Room - Street - Locality"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="input-box">
          <span>City:</span>
          <input
            type="text"
            name="city"
            placeholder="Mumbai"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="flex">
          <div className="input-box">
            <span>State:</span>
            <input
              type="text"
              name="state"
              placeholder="India"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <div className="input-box">
            <span>Zip Code:</span>
            <input
              type="text"
              name="zip-code"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="payment-details">
        <h3 className="title">Payment</h3>

        <div className="inputBox">
          <span>cards accepted :</span>
          <img src={paypal} alt="paypal" />
        </div>
        <div className="input-box">
          <span>Credit Card Number:</span>
          <input
            type="text"
            name="card-number"
            placeholder="1111-2222-3333-4444"
            value={cardNumber}
            onChange={handleCardNumberChange}
          />
        </div>
        <div className="input-box">
          <span>Expiration Date:</span>
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
        <h3>Summary:</h3>
        {cartItems.length > 0 ? (
          cartItems.map((item) => {
            const party = allParties.find((party) => party.id === item.id);
            if (party) {
              return (
                <div className="checkout-parties-item" key={party.id}>
                  <p>{party.name}</p>
                  <p>Quantity: {item.cantidad}</p>
                  <p>Total: ${party.new_price * item.cantidad}</p>
                  <button onClick={() => handleRemoveFromCart(party.id)}>
                    Remove
                  </button>
                </div>
              );
            }
            return null;
          })
        ) : (
          <p>No items in the cart</p>
        )}
      </div>
      <div className="checkout-total">
        <p>Subtotal: ${totalAmount}</p>
        <p>Shipping: Free</p>
        <p>Total: ${totalAmount}</p>
        <button onClick={() => handleDescountStock()}>Purchase</button>
      </div>

      {showSuccessMessage && (
        <div className="success-message">
          <h2>Successful purchase!</h2>
          <p>You will receive the ticket information via email.</p>
        </div>
      )}
    </div>
  );
};

export default Checkout;
