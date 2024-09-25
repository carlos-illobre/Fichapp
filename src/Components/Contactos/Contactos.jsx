import React, { useState } from 'react';
import './Contactos.css';

function Contactos() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!nombre || !email || !mensaje) {
      setErrorMessage('Por favor, completa todos los campos.');
      setTimeout(() => setErrorMessage(''), 5000); // Borra el mensaje en 5 segundos
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Por favor, ingresa un correo electrónico válido.');
      setTimeout(() => setErrorMessage(''), 5000); // Borra el mensaje despues de  5 segundos
      return;
    }

    console.log('Enviando formulario', { nombre, email, mensaje });
    setNombre('');
    setEmail('');
    setMensaje('');
    setEnviado(true);
    setTimeout(() => {
      setEnviado(false);
      setErrorMessage(''); 
    }, 5000);
  };

  return (
    <div>
      {enviado && <p className="mensaje-enviado">Formulario enviado correctamente!</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="formulario">
        <div className="input-container">
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
        </div>
        <div className="input-container">
          <label>Email:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="input-container">
          <label>Mensaje:</label>
          <textarea value={mensaje} onChange={e => setMensaje(e.target.value)} />
        </div>
        <button className="Botonenviar" type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default Contactos;
