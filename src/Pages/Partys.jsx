import React, { useEffect } from "react";
import { useSelector } from "react-redux"; 
import { useParams } from "react-router-dom";
import RelatedPartys from "../Components/RelatedPartys/RelatedPartys";
import "./CSS/Partys.css";
import HeaderParty from "../Components/HeaderParty/HeaderParty";
import BotonesParty from "../Components/BotonesParty/BotonesParty";
import { selectAllPiezas } from "../ReduxToolkit/partySlice";

const Partys = () => {
  const allParties = useSelector(selectAllPiezas);
  const { partyId } = useParams();
  const party = allParties.find((e) => e.id === Number(partyId));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!party) {
    return <div>Loading...</div>; // Manejar el caso donde el partido no se encuentra
  }

  return (
    <div>
      <HeaderParty party={party} />
      <div>
        <BotonesParty party={party} />
      </div>

      <div>
        <h3>Imágenes del Evento:</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {party.images.map((imageUrl, index) => (
            <img
              key={index}
              src={imageUrl}
              alt={`Imagen del Evento ${index + 1}`}
              style={{ maxWidth: "100px", height: "auto", marginRight: "10px", marginBottom: "10px" }}
            />
          ))}
        </div>
      </div>

      <div>
        <RelatedPartys style={{ marginTop: "20px" }} />
      </div>
    </div>
  );
};

export default Partys;
