import React, { useState } from "react";
import "./CartItems.css";
import remove_icon from "../Assets/remove_icon.png";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, selectCartItems, selectTotalCartItems, selectDiscount, applyPromoCode, selectSubtotal, selectTotalCartAmount } from "../../ReduxToolkit/cartSlice";

const CartItems = () => {
  const cartItems = useSelector(selectCartItems);
  const totalCartItems = useSelector(selectTotalCartItems); // eslint-disable-line no-unused-vars
  const discountApplied = useSelector(selectDiscount);
  const subtotal = useSelector(selectSubtotal);
  const totalAmount = useSelector(selectTotalCartAmount);
  const dispatch = useDispatch();
  const [promoCode, setPromoCode] = useState("");

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const handleApplyPromoCode = () => {
    if (promoCode === "1234") {
      dispatch(applyPromoCode(promoCode));
    } else {
      alert("El código promocional no es válido");
    }
  };

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Productos</p>
        <p>Titulo</p>
        <p>Precio</p>
        <p>Cantidad</p>
        <p>Total</p>
        <p>Remover</p>
      </div>
      <hr />
      <div>
        {cartItems.map((item) => (
          <div key={item.id}>
            <div className="cartitems-format cartitems-format-main">
              <img
                src={item.image}
                alt=""
                className="carticon-product-icon"
              />
              <p>{item.juego}</p>
              <p>${item.price}</p>
              <button className="cartitems-quantity">{item.cantidad}</button>
              <p>${item.price * item.cantidad}</p>
              <img
                className="cartitems-remove-icon"
                src={remove_icon}
                onClick={() => handleRemoveFromCart(item.id)}
                alt=""
              />
            </div>
            <hr />
          </div>
        ))}
        <div className="cartitems-promocode">
          <p>Si tienes un código de descuento, agrégalo aquí</p>
          <div className="cartitems-promobox">
            <input
              type="text"
              placeholder="Código promocional"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button onClick={handleApplyPromoCode}>Aceptar</button>
          </div>
        </div>
        <div className="cartitems-down">
          <div className="cartitems-total">
            <h1>Total Carrito</h1>
            <div>
              <div className="cartitems-total-item">
                <p>Subtotal</p>
                <p>${subtotal}</p>
              </div>
              <hr />
              <div className="cartitems-total-item">
                <p>Descuento</p>
                <p>${discountApplied ? subtotal * 0.1 : 0}</p>
              </div>
              <hr />
              <div className="cartitems-total-item">
                <h3>Total</h3>
                <h3>${totalAmount}</h3>
              </div>
            </div>
            <Link to="/payments">
              <button>PROCEDER CON LA COMPRA</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
