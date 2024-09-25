import React, { useState, useEffect } from "react";
import "./CSS/LoginSignup.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../ReduxToolkit/userSlice";

const LoginUser = () => {
  const dispatch = useDispatch();
  const [registro, setRegistro] = useState({role:"ADMIN",name:"", email: "", password: "", isLogged: false });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onChangeValues = ({ target }) => {
    setRegistro({ ...registro, [target.name]: target.value, isLogged: true });
  };

  const handleContinuarClick = () => {
    const { name, email, password, role } = registro;

    if (!name || !email || !password) {
      setErrorMessage("Por favor, completá todos los campos.");
      return;
    }

    dispatch(setUser(registro)); // actualizar el estado del usuario en Redux
    navigate("/");
    setErrorMessage("");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>Inicia Sesión</h1>
        <div className="loginsignup-fields">
        <input
            type="text"
            name="name"
            onChange={onChangeValues}
            placeholder="Tu Nombre"
            value={registro.name}
          />
          <input
            type="email"
            name="email"
            onChange={onChangeValues}
            placeholder="Tu Email"
            value={registro.email}
          />
          <input
            type="password"
            name="password"
            onChange={onChangeValues}
            placeholder="Tu Contraseña"
            value={registro.password}
          />
        </div>
        {errorMessage && (
          <p className="error-message" style={{ color: "red" }}>
            {errorMessage}
          </p>
        )}
        <button onClick={handleContinuarClick}>Iniciar Sesión</button>
        <p className="loginsignup-login">
          No tienes una cuenta?{" "}
          <span onClick={() => navigate("/loginSignUp")}>Registrate</span>
        </p>
      </div>
    </div>
  );
};

export default LoginUser;
