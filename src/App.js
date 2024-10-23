import React from 'react';
import Nabvar from './Components/Navbar/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import EventsCategory from './Pages/EventsCategory';
import Partys from './Pages/Partys';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Footer from './Components/Footer/Footer';
import AgregarFiesta from './Pages/AgregarFiesta';
import ModificarFiesta from './Pages/ModificarFiesta';
import Payments from "./Pages/Payments";
import LoginUser from './Pages/LoginUser';
import BotonesParty from './Components/BotonesParty/BotonesParty';
import TERMINOS_Y_CONDICIONES from './Pages/Terminos_y_condiciones';
import Contacto from './Pages/Contacto';
import '@fortawesome/fontawesome-free/css/all.min.css';
import PiezasPage from './Pages/Piezas';
import PiezasEmpresaPage from './Pages/PiezasEmpresa';
import UserProfile from './Components/UserProfile/UserProfile'; // Ajusta la ruta si es necesario
import PiezasImpresoraPage from './Pages/PiezasImpresora';

function App() {
  
  return (
  
      <div>
        <BrowserRouter>
        <Nabvar />
        <Routes>
          <Route path='/' element={<EventsCategory />} />
          <Route path='/partys' element={<Partys />} />
          <Route path="/payments" element={<Payments />} />
          <Route path='/partys/:partyId' element={<Partys />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/loginSignUp' element={<LoginSignup />} />
          <Route path='/loginUser' element={<LoginUser />} />
          <Route path="/agregarFiesta" element={<AgregarFiesta />} />
          <Route path="/modificarFiesta" element={<ModificarFiesta />} />
          <Route path="/EventsCategory" element={<EventsCategory />} />
          <Route path="/comprar" element={<BotonesParty />} />
          <Route path="/Terminos_y_condiciones" element={<TERMINOS_Y_CONDICIONES />} />
          <Route path="/Contacto" element={<Contacto />} />
          <Route path="/Piezas" element={<PiezasPage />} />
          <Route path="/PiezasEmpresa" element={<PiezasEmpresaPage />} />
          <Route path="/PiezasImpresora" element={<PiezasImpresoraPage />} />
          <Route path="/user-profile" element={<UserProfile />} /> {/* Nueva ruta para el perfil */}
        </Routes>
        <Footer />
        </BrowserRouter>
      </div>
  );
}

export default App;