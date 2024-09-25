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
import Terminos_y_condiciones from './Pages/Terminos_y_condiciones';
import Contacto from './Pages/Contacto';
import '@fortawesome/fontawesome-free/css/all.min.css';

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
          <Route path="/Terminos_y_condiciones" element={<Terminos_y_condiciones />} />
          <Route path="/Contacto" element={<Contacto />} />
        </Routes>
        <Footer />
        </BrowserRouter>
      </div>
  );
}

export default App;