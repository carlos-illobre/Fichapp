import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "./CSS/EventsCategory.css";
import "./CSS/PiezasImpresora.css";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { setFoundPiezasUser, selectFoundPiezasUser, selectFoundPiezasEmpresa } from "../ReduxToolkit/partySlice";

const PiezasEmpresaPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const piezasEmp = useSelector(selectFoundPiezasEmpresa);

  const handleSearchJuegosEmpresas = async () => {
    if (user.email && user.email.length >= 3) {
      const piezasCollection = collection(db, 'pubEmpresas');
      const queryPiezaUser = query(piezasCollection, where('email', '==', user.email));

      try {
        const querySnapshotPiezaUser = await getDocs(queryPiezaUser);
        const piezasUser = [];

        querySnapshotPiezaUser.forEach((doc) => {
          piezasUser.push({ id: doc.id, ...doc.data() });
        });

        dispatch(setFoundPiezasUser(piezasUser));
      } catch (error) {
        console.error('Error al realizar la búsqueda:', error);
      }
    }
  };

  useEffect(() => {
    handleSearchJuegosEmpresas();
  }, []); // Empty dependency array ensures it runs only once on mount

  return (
    <div className="impresoras-results">
      {piezasEmp && piezasEmp.length > 0 ? (
        piezasEmp.map((pieza, index) => (
          <div key={index} className="impresora-card">
            <img className="impresora-image" src={pieza.image} alt={pieza.juego} />
            <h4 className="user-name">{pieza.nombre}</h4>
            <p className="location">{pieza.barrio}</p>
            <p className="price">Tarifa: ${pieza.price}</p>
          </div>
        ))
      ) : (
        <p>No se encontraron piezas.</p>
      )}
    </div>
  );
};

export default PiezasEmpresaPage;
