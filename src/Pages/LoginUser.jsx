import React, { useState, useEffect } from "react";
import "./CSS/LoginSignup.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../ReduxToolkit/userSlice";
import { auth, googleProvider } from "../firebase"; 
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

const LoginUser = () => {
  const dispatch = useDispatch();
  const [registro, setRegistro] = useState({role:"ADMIN",name:"", email: "", password: "", isLogged: false });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onChangeValues = ({ target }) => {
    setRegistro({ ...registro, [target.name]: target.value, isLogged: true });
  };

  const handleContinuarClick = async () => {
    const { email, password } = registro;

    if (!email || !password) {
      setErrorMessage("Por favor, completá todos los campos.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user.email);
      dispatch(setUser({ ...registro, isLogged: true })); // actualizar el estado del usuario en Redux
      navigate("/");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      dispatch(setUser({
        name: user.displayName,
        email: user.email,
        role: "ADMIN", // Aquí puedes ajustar según tu lógica de roles
        isLogged: true
      }));
      navigate("/");
    } catch (error) {
      setErrorMessage("Error al iniciar sesión con Google.");
    }
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
        <button onClick={handleGoogleLogin}>Iniciar Sesión con Google</button>
        <p className="loginsignup-login">
          No tienes una cuenta?{" "}
          <span onClick={() => navigate("/loginSignUp")}>Registrate</span>
        </p>
      </div>
    </div>
  );
};

export default LoginUser;
