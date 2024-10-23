
import React, { useState } from "react";
import "./carousel.css";

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  console.log('images: ', images)
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="carousel">
      <div className="carousel-inner">
        <img
          className="carousel-image"
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
        />
      </div>
      <button className="carousel-btn prev" onClick={goToPrevious}>
        &#10094;
      </button>
      <button className="carousel-btn next" onClick={goToNext}>
        &#10095;
      </button>
    </div>
  );
};

export default Carousel;
