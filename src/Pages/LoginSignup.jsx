import React, { useState, useEffect } from "react";
import "./CSS/LoginSignup.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../ReduxToolkit/userSlice";
import { auth, googleProvider } from "../firebase"; 
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";

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

  const handleContinuarClick = async () => {
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
    
    if (!isValidPassword(password)) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      // Registro de usuario con Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Si el registro es exitoso, actualizamos el estado global con Redux
      dispatch(setUser({ ...registro, isLogged: true, uid: user.uid }));
      setErrorMessage("");

      // Navegamos al inicio
      navigate("/");
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      let message = "";
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = "El correo electrónico ya está en uso. Por favor, prueba con otro.";
          break;
        case 'auth/invalid-email':
          message = "El correo electrónico no es válido. Por favor, ingresa un correo electrónico correcto.";
          break;
        case 'auth/weak-password':
          message = "La contraseña es demasiado débil. Por favor, elige una contraseña más fuerte.";
          break;
        default:
          message = "Error al registrar el usuario. Inténtalo de nuevo.";
      }
      setErrorMessage(message);
    }
  };

  // Nueva función para manejar el registro con Google
  const handleGoogleSignup = async () => {
    if (!aceptarTerminos) {
      setErrorMessage("Debes aceptar nuestros Términos y Condiciones para registrarte con Google.");
      return;
    }

    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Actualizamos el estado global con Redux
      dispatch(setUser({ name: user.displayName, email: user.email, isLogged: true, uid: user.uid }));
      navigate("/");
    } catch (error) {
      console.error("Error al registrarse con Google:", error);
      setErrorMessage("Error al registrarse con Google. Inténtalo de nuevo.");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    return password.length >= 6;
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
        {/* Botón para registrarse con Google, ahora revisa si se aceptan los términos */}
        <button onClick={handleGoogleSignup}>Registrarse con Google</button>
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
