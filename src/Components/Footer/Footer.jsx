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
      <MDBContainer className='p-4 pb-0'>
        {/* Botones de redes sociales */}
        <section className='mb-4'>
          <MDBBtn outline color="light" floating className='m-1' href='https://www.facebook.com/profile.php?id=61559052163323' target="_blank" role='button'>
            <MDBIcon fab icon='facebook-f' />
          </MDBBtn>

          <MDBBtn outline color="light" floating className='m-1' href='https://twitter.com/FestTicketTrust' target="_blank" role='button'>
            <MDBIcon fab icon='twitter' />
          </MDBBtn>

          <MDBBtn outline color="light" floating className='m-1' href='#' target="_blank" role='button'>
            <MDBIcon className="far fa-envelope"/>
          </MDBBtn>

          <MDBBtn outline color="light" floating className='m-1' href='https://www.instagram.com/festtickets11/' target="_blank" role='button'>
            <MDBIcon fab icon='instagram' />
          </MDBBtn>

          <MDBBtn outline color="light" floating className='m-1' href='https://www.youtube.com/' target="_blank" role='button'>
            <MDBIcon fab icon='youtube' />
          </MDBBtn>

          <MDBBtn outline color="light" floating className='m-1' href='https://github.com/ElishebaTawil/AppIntG1-Front' target="_blank" role='button'>
            <MDBIcon fab icon='github' />
          </MDBBtn>
        </section>
      </MDBContainer>

      <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        <p>Copyright @2024 - Todos Los Derechos Reservados &nbsp;
        <Link to="/Terminos_y_condiciones" className="button-link">Terminos y condiciones</Link> -&nbsp;
        <Link to="/Contacto" className="button-link">Contacto</Link></p>
        <p>
        TP APIS Integrantes: Maximo Rosso - Elisheba Tawil - Tadeo Pinque - Sebastian Sosa - Maurico Huentelaf
        </p>
      </div>
    </MDBFooter>
  );
}

export default Footer;
