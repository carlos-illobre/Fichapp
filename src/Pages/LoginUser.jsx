import React, { useState, useEffect } from "react";
import "./CSS/LoginSignup.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../ReduxToolkit/userSlice";
import { auth, googleProvider } from "../firebase"; 
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const LoginUser = () => {
  const dispatch = useDispatch();
  const [registro, setRegistro] = useState({ role: "ADMIN", name: "", email: "", password: "", isLogged: false });
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

      // Obtener el nombre del usuario desde Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Actualizar el estado del usuario en Redux con el nombre
        dispatch(setUser({ 
          name: userData.name,
          email: user.email,
          role: "ADMIN",
          isLogged: true
        }));
        navigate("/");
        setErrorMessage("");
      } else {
        console.log("No existe el documento del usuario.");
        setErrorMessage("No existe el documento del usuario.");
      }

    } catch (error) {
      console.log(error.code)
      switch (error.code) {
        case 'auth/invalid-email':
          setErrorMessage("El correo electrónico no es válido.");
          break;
        case 'auth/user-disabled':
          setErrorMessage("El usuario ha sido deshabilitado.");
          break;
        case 'auth/user-not-found':
          setErrorMessage("No se encontró un usuario con ese correo electrónico.");
          break;
        case 'auth/wrong-password':
          setErrorMessage("La contraseña es incorrecta.");
          break;
        case 'auth/invalid-credential':
          setErrorMessage("Las credenciales proporcionadas son inválidas. Verifica tu correo y contraseña.");
          break;
        case 'auth/too-many-requests':
          setErrorMessage("Demasiadas solicitudes. Intenta de nuevo más tarde.");
          break;
        case 'auth/network-request-failed':
          setErrorMessage("Error de red. Verifica tu conexión.");
          break;
        default:
          setErrorMessage("Error al iniciar sesión. Verifica tus credenciales.");
          break;
      }
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
