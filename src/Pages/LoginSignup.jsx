import React, { useState, useEffect } from "react";
import "./CSS/LoginSignup.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../ReduxToolkit/userSlice";

const LoginSignup = () => {
  const dispatch = useDispatch();
  const [registro, setRegistro] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER", // Asignamos automáticamente el rol como "USER"
    isLogged: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [aceptarTerminos, setAceptarTerminos] = useState(false);
  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setAceptarTerminos(!aceptarTerminos);
  };

  const onChangeValues = ({ target }) => {
    setRegistro({ ...registro, [target.name]: target.value });
  };

  const handleContinuarClick = () => {
    const { name, email, password } = registro;
    if (!name || !email || !password) {
      setErrorMessage("Por favor, completa todos los campos.");
      return;
    }
    if (!aceptarTerminos) {
      setErrorMessage("Debes aceptar nuestros Términos y Condiciones.");
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMessage("Por favor, ingresa un correo electrónico válido.");
      return;
    }
    dispatch(setUser({...registro, isLogged:true}));
    navigate("/");
    setErrorMessage("");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>Regístrate</h1>
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
        <button onClick={handleContinuarClick}>Continuar</button>
        <p className="loginsignup-login">
          ¿Ya tienes una cuenta?{" "}
          <span onClick={() => navigate("/loginUser")}>Inicia Sesión</span>
        </p>
        <div className="loginsignup-agree">
          <input
            type="checkbox"
            checked={aceptarTerminos}
            onChange={handleCheckboxChange}
          />
          <p className="loginsignup-login">
            Al registrarte aceptas nuestros <span>Términos y Condiciones</span>{" "}
            y <span>Política de Privacidad</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
