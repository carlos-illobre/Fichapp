import { Link } from 'react-router-dom';
import React from 'react';
import "./Footer.css"

import {
  MDBFooter,
  MDBContainer,
  MDBIcon,
  MDBBtn
} from 'mdb-react-ui-kit';

const Footer = () => {
  return (
    <MDBFooter className='bg-dark text-center text-white'>
      

      <div className='text-center p-3' style={{ backgroundColor: 'rgba(27,49,115)' }}>
        <p>Copyright @2024 - Todos Los Derechos Reservados &nbsp;
        <Link to="/Terminos_y_condiciones" className="button-link">Terminos y condiciones</Link> -&nbsp;
        <Link to="/Contacto" className="button-link">Contacto</Link></p>
        <p>
        TP SIPI Integrantes: Albarellos, Nicolas - Elisheba Tawil - Azcoaga Puyó, 
        Christian Emanuel - Bulfon, Juan - Illobre, Carlos -  <br /> Maldonado, Facundo  - Prieto, Sebastián Esteban - Santillán, Nahuel - Tercero, Franco
        </p>
      </div>
    </MDBFooter>
  );
}

export default Footer;
