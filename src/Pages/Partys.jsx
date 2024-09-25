import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import RelatedPartys from "../Components/RelatedPartys/RelatedPartys";
import "./CSS/Partys.css";
import HeaderParty from "../Components/HeaderParty/HeaderParty";
import BotonesParty from "../Components/BotonesParty/BotonesParty";
import { useNavigate } from "react-router-dom";
import { selectAllParties } from "../ReduxToolkit/partySlice";

const Partys = () => {
  const dispatch = useDispatch();
  const allParties = useSelector(selectAllParties);
  const { partyId } = useParams();
  const party = allParties.find((e) => e.id === Number(partyId));
  const navigate = useNavigate();

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
        <RelatedPartys style={{ marginTop: "20px" }} />
      </div>
    </div>
  );
};

export default Partys;
