import "./HeaderParty.css";

const HeaderParty = (props) => {
  const { party } = props;
  return (
    <div className="contenedor">
      <div
        className="imagenHeader"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${party.image})`,
        }}
      >
        <div className="tituloParty">
          <h1>{party.name}</h1>
        </div>
      </div>
    </div>
  );
};

export default HeaderParty;
