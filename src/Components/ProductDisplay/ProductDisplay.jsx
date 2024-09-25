import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.jpg";
import star_dull_icon from "../Assets/star_dull_icon.jpg";

const ProductDisplay = (props) => {
  const { party } = props;

  return (
    <div className="partydisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={party.image} alt="" />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{party.name}</h1>
        <div className="productdisplay-right-star">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
          <p>(122)</p>
        </div>
        <div className="productdisplay-right-prices">
          {party.new_price > 1 && (
            <div className="productdisplay-right-price-new">
              $ {party.new_price}
            </div>
          )}
          {party.old_price > 1 && (
            <div className="productdisplay-right-price-old">
              $ {party.old_price}
            </div>
          )}
        </div>
        <div className="productdisplay-right-description">Party</div>

        <p className="productdisplay-right-category">
          {" "}
          <span>Fiesta</span>
        </p>
        <p className="productdisplay-right-category">
          {" "}
          <span>Fiesta, Boliche, Noche, Amigos</span>
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
